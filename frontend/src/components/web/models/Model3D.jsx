import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RotateCcw, RotateCw, Download, Eye, Grid3X3, Box, Move3D, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from 'react-router';
import productService from "../../../services/productService";
const ModelViewer = React.lazy(() => import("./ModelViewer"));

export default function Model3D() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [viewMode, setViewMode] = useState("3d");
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [cameraResetFn, setCameraResetFn] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();
  const navigate = useNavigate();

  // Loader 2 วิ
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const rotateModel = (axis, direction) => {
    const step = Math.PI / 6;
    setModelRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + direction * step,
    }));
  };

  const resetRotation = () => setModelRotation({ x: 0, y: 0, z: 0 });

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "model-screenshot.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6  min-h-screen text-gray-900">
      {/* Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b flex items-center justify-between bg-white rounded-xl shadow-sm mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-500 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center flex-1">
          <h1 className="text-red-600 text-lg sm:text-2xl font-extrabold">
            {loadingProduct
              ? "Loading..."
              : product?.name }
          </h1>
          <p className="text-sm text-gray-500">
            Category: {product?.category?.name || product?.category || "-"}
          </p>
        </div>
      </div>

      {/* Viewer + Controls Container */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Controls - Desktop */}
        <div className="hidden md:flex flex-col gap-3 md:w-16 justify-start">
          {[{ label: "Grid", icon: Grid3X3, state: showGrid, setter: setShowGrid },
          { label: "Dimensions", icon: Box, state: showDimensions, setter: setShowDimensions },
          { label: "Annotations", icon: Eye, state: showAnnotations, setter: setShowAnnotations }].map(({ label, icon: Icon, state, setter }) => (
            <button
              key={label}
              onClick={() => setter(!state)}
              className={`p-3 rounded-xl border transition-all duration-300 ${state ? "bg-gradient-to-br from-red-500 to-orange-500 text-white border-red-400 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}
              title={label}
            >
              <Icon size={20} />
            </button>
          ))}
          <button
            onClick={downloadImage}
            className="p-3 bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl text-white shadow-md mt-2"
            title="Download Screenshot"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => cameraResetFn && cameraResetFn()}
            className="p-3 bg-gradient-to-br from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 rounded-xl text-white shadow-md"
            title="Reset Camera"
          >
            <Move3D size={20} />
          </button>
        </div>

        {/* Canvas Container */}
        <div className="relative flex-1 bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="w-full h-[400px] sm:h-[500px] md:h-[650px]">
            <Canvas
              ref={canvasRef}
              camera={{ position: [4, 4, 4], fov: 50 }}
              gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
              className="w-full h-full"
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={0.7} />
              <directionalLight position={[-5, 5, -5]} intensity={0.4} />

              {loading ? (
                <Html center>
                  <div className="bg-white px-6 py-4 rounded-xl shadow-md flex flex-col items-center gap-4">
                    <p className="text-gray-700 font-medium text-lg">Loading 3D Model...</p>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </Html>
              ) : (
                <Suspense fallback={null}>
                  <ModelViewer
                    productId={product?.id}
                    showGrid={showGrid}
                    showAnnotations={showAnnotations}
                    showDimensions={showDimensions}
                    viewMode={viewMode}
                    modelRotation={modelRotation}
                    onCameraReset={setCameraResetFn}
                  />
                </Suspense>
              )}
            </Canvas>

            {/* Rotation Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">

              {[
                { axis: "y", dir: -1, icon: <RotateCcw size={18} /> },
                { axis: "x", dir: -1, icon: "↑" },
                { axis: "y", dir: 1, icon: <RotateCw size={18} /> },
                { axis: "z", dir: -1, icon: "↺" },
                { axis: "x", dir: 1, icon: "↓" },
                { axis: "z", dir: 1, icon: "↻" },
              ].map(({ axis, dir, icon }, idx) => (
                <button
                  key={idx}
                  onClick={() => rotateModel(axis, dir)}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-400 text-white rounded-xl shadow-md hover:scale-110 transition transform"
                  title={`Rotate ${axis.toUpperCase()} ${dir === 1 ? "Positive" : "Negative"}`}
                >
                  {icon}
                </button>
              ))}
              <button
                onClick={resetRotation}
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-400 text-white rounded-xl shadow-md hover:scale-110 transition transform"
                title="Reset Rotation"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* View Modes */}
        <div className="hidden md:flex flex-col gap-2 md:w-20 justify-start">
          {["front", "back", "left", "right", "top", "bottom", "3d"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${viewMode === mode ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="flex md:hidden overflow-x-auto gap-3 mt-4 p-2 bg-white/80 rounded-xl shadow-md">
        {[{ label: "Grid", icon: Grid3X3, state: showGrid, setter: setShowGrid },
        { label: "Dimensions", icon: Box, state: showDimensions, setter: setShowDimensions },
        { label: "Annotations", icon: Eye, state: showAnnotations, setter: setShowAnnotations },
        { label: "Download", icon: Download, action: downloadImage },
        { label: "Reset", icon: Move3D, action: () => cameraResetFn && cameraResetFn() }].map(({ label, icon: Icon, state, setter, action }) => (
          <button
            key={label}
            onClick={() => setter ? setter(!state) : action()}
            className={`flex items-center justify-center min-w-[50px] p-3 rounded-xl border transition-all duration-300 ${state ? "bg-gradient-to-br from-red-500 to-orange-500 text-white border-red-400 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Mobile View Modes */}
      <div className="flex md:hidden overflow-x-auto gap-2 mt-3 p-2 bg-white/80 rounded-xl shadow-md">
        {["front", "back", "left", "right", "top", "bottom", "3d"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${viewMode === mode ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
