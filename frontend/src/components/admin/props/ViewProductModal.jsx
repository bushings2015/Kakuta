import React from "react";
import { X, Upload } from "lucide-react";
import { API_IMAGE_URL } from "../../../configs/constants";

const ViewProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg w-5/6 max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name */}
        <div className="mb-4">
          <h4 className="font-semibold">Name:</h4>
          <p>{product.name}</p>
        </div>

        {/* Category */}
        <div className="mb-4">
          <h4 className="font-semibold">Category:</h4>
          <p>{product.category?.name || "No Category"}</p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-semibold">Description:</h4>
          <p>{product.description || "-"}</p>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">
            Sizes ({product.sizes?.length || 0})
          </h4>
          {product.sizes && product.sizes.length > 0 ? (
            product.sizes.map((size) => (
              <div
                key={size.id || size._id || size.holdingCapacityMetric}
                className="border border-gray-200 rounded-lg p-3 mb-2"
              >
                <h5 className="font-medium text-gray-700 mb-2">
                  Size {size.id || "-"}
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  {/* Metric */}
                  <div>
                    <h6 className="font-medium text-green-600 mb-1">Metric</h6>
                    <p>Holding Capacity: {size.holdingCapacityMetric || "-"}</p>
                    <p>Weight: {size.weightMetric || "-"}</p>
                    <p>Handle Moves: {size.handleMovesMetric || "-"}</p>
                    <p>Bar Moves: {size.barMovesMetric || "-"}</p>
                    <p>Drawing Movement: {size.drawingMovementMetric || "-"}</p>
                  </div>
                  {/* Imperial */}
                  <div>
                    <h6 className="font-medium text-blue-600 mb-1">Imperial</h6>
                    <p>Holding Capacity: {size.holdingCapacityInch || "-"}</p>
                    <p>Weight: {size.weightInch || "-"}</p>
                    <p>Handle Moves: {size.handleMovesInch || "-"}</p>
                    <p>Bar Moves: {size.barMovesInch || "-"}</p>
                    <p>Drawing Movement: {size.drawingMovementInch || "-"}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No sizes available</p>
          )}
        </div>

        {/* Images */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Images</h4>
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
              {product.images.map((img, index) => (
                <img
                  key={img.id || index}
                  src={`${API_IMAGE_URL}${img.imageUrl}`}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-40 object-cover rounded"
                />
              ))}
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        {/* 3D Models */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">3D Model Files</h4>
          {product.models && product.models.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {product.models.map((model, idx) => (
                <div
                  key={model.id || idx}
                  className="flex gap-2 items-center"
                >
                  {model.gltfUrl && (
                    <a
                      href={model.gltfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      GLTF
                    </a>
                  )}
                  {model.binUrl && (
                    <a
                      href={model.binUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                    >
                      BIN
                    </a>
                  )}
                  {model.stepUrl && (
                    <a
                      href={model.stepUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                    >
                      STEP
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No models uploaded</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
