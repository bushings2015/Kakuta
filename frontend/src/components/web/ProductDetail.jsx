import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Mail, X, ChevronLeft, ChevronRight } from "lucide-react";
import productService from "../../services/productService";
import { API_IMAGE_URL } from "../../configs/constants";
import sendEmailService from "../../services/sendEmailService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [unit, setUnit] = useState("inch");
  const [view, setView] = useState("image");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleRequest3D = async () => {
    if (!customerEmail) return;
    setSending(true);
    try {
      await sendEmailService.request3DFile({
        productId: product.id,
        productName: product.name,
        email: customerEmail,
        firstName: customerFirstName,
        lastName: customerLastName,
        message: message,
      });
      alert("Request sent successfully!");
      setShowModal(false);
      setCustomerEmail("");
      setCustomerFirstName("");
      setCustomerLastName("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const nextImage = () => {
    if (!product?.images) return;
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setCurrentIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  if (loading) return <p className="text-center py-10">Loading product...</p>;
  if (error || !product)
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Go Back
        </button>
      </div>
    );

  const images = product.images || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-red-500 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Images */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          {/* Main Image */}
          {images.length > 0 && (
            <div
              className="relative w-full  rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              <img
                src={`${API_IMAGE_URL}${images[currentIndex].imageUrl}`}
                alt={`Product image ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {/* Two-column Grid for Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 transition-transform duration-300 cursor-pointer ${currentIndex === index
                    ? "border-red-500 scale-105"
                    : "border-gray-200"
                    }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={`${API_IMAGE_URL}${img.imageUrl}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-700">{product.details}</p>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-sm text-gray-500">
            Category: {product.category?.name || product.category}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              className={`px-5 py-2 rounded-lg font-medium transition-all ${view === "image"
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => setView("image")}
            >
              Images
            </button>
            <button
              className={`px-5 py-2 rounded-lg font-medium transition-all ${view === "3d"
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() =>
                navigate(`/products/${product.id}/generatemodel`)
              }
            >
              3D Model
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
            >
              <Mail className="w-4 h-4" /> Request 3D File
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex gap-4 mt-4">
            {["inch", "metric"].map((u) => (
              <button
                key={u}
                className={`px-5 py-2 rounded-lg font-medium ${unit === u
                  ? "bg-red-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={() => setUnit(u)}
              >
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>

          {/* Specifications */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Specifications ({unit === "inch" ? "Inch" : "Metric"})
            </h2>
            {product.sizes && product.sizes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b px-3 py-2 text-gray-600 font-medium">Feature</th>
                      <th className="border-b px-3 py-2 text-gray-600 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizes.map((size, idx) => (
                      <React.Fragment key={size.id}>
                        <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="border-b px-3 py-2">Holding Capacity</td>
                          <td className="border-b px-3 py-2">
                            {unit === "inch" ? size.holdingCapacityInch || "-" : size.holdingCapacityMetric || "-"}
                          </td>
                        </tr>
                        <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="border-b px-3 py-2">Weight</td>
                          <td className="border-b px-3 py-2">
                            {unit === "inch" ? size.weightInch || "-" : size.weightMetric || "-"}
                          </td>
                        </tr>
                        {size.handleMovesInch || size.handleMovesMetric ? (
                          <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="border-b px-3 py-2">Handle Moves</td>
                            <td className="border-b px-3 py-2">
                              {unit === "inch" ? size.handleMovesInch || "-" : size.handleMovesMetric || "-"}
                            </td>
                          </tr>
                        ) : (
                          <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="border-b px-3 py-2">Handle Moves</td>
                            <td className="border-b px-3 py-2">-</td>
                          </tr>
                        )}
                        {size.barMovesInch || size.barMovesMetric ? (
                          <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="border-b px-3 py-2">Bar Moves</td>
                            <td className="border-b px-3 py-2">
                              {unit === "inch" ? size.barMovesInch || "-" : size.barMovesMetric || "-"}
                            </td>
                          </tr>
                        ) : (
                          <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="border-b px-3 py-2">Bar Moves</td>
                            <td className="border-b px-3 py-2">-</td>
                          </tr>
                        )}
                        <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="border-b px-3 py-2">Drawing Movement</td>
                          <td className="border-b px-3 py-2">
                            {unit === "inch" ? size.drawingMovementInch || "-" : size.drawingMovementMetric || "-"}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No specifications available</p>
            )}
          </div>

        </div>
      </div>

      {/* Image Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-full max-w-5xl flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Zoomed Image */}
            <img
              src={`${API_IMAGE_URL}${images[currentIndex].imageUrl}`}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-containshadow-lg"
            />

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white transition"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      )}

      {/* Request 3D Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Request 3D File</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="First Name"
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <input
              type="email"
              placeholder="Your email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest3D}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
