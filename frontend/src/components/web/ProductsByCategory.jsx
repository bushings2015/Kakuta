import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { API_IMAGE_URL } from "../../configs/constants";

const ProductsGallery = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(["All", ...(res.data.data?.map(c => c.name) || [])]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res =
          selectedCategory === "All"
            ? await productService.getAllProducts()
            : await productService.searchProductByCategory(selectedCategory);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return <p className="text-center py-20">Loading products...</p>;
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${selectedCategory === cat
                ? "bg-red-600 text-white shadow-lg"
                : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative w-full aspect-square overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white text-center p-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm mt-1">{product.category?.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-gray-700">
            No products found in this category.
          </p>
        )}


      </div>
    </section>
  );
};

export default ProductsGallery;
