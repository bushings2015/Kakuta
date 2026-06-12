import React, { useRef, useEffect, useState, Suspense } from "react";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { API_MODEL_URL } from "../../../configs/constants";
import productService from "../../../services/productService";
import { useParams } from 'react-router';

function Model({ url, rotation }) {
  const meshRef = useRef();
  const { scene, nodes, materials } = useGLTF(url, true);

  // Center + auto-scale + shadow/material tweaks
  useEffect(() => {
    if (!scene) return;

    // Center
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    scene.position.copy(center.multiplyScalar(-1));

    // Scale
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 3) scene.scale.setScalar(2 / maxDim);
    else if (maxDim < 0.5) scene.scale.setScalar(2 / maxDim);

    // Shadows + Material tweak
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material?.color) {
          const hsl = {};
          child.material.color.getHSL(hsl);
          if (hsl.l < 0.2) child.material.color.setHSL(hsl.h, hsl.s, 0.4);
        }

        child.material.metalness = child.material.metalness || 0.3;
        child.material.roughness = child.material.roughness || 0.4;
      }
    });
  }, [scene, nodes, materials]);

  // Apply rotation
  useEffect(() => {
    if (meshRef.current && rotation) {
      meshRef.current.rotation.x = rotation.x;
      meshRef.current.rotation.y = rotation.y;
      meshRef.current.rotation.z = rotation.z;
    }
  }, [rotation]);

  return <primitive ref={meshRef} object={scene} dispose={null} />;
}

export default function ToggleClampModel({ rotation }) {
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams()
  
  useEffect(() => {
    if (!productId) return; 

    const fetchModel = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getProductModels(productId);

        if (res.data.data && res.data.data.length > 0) {
          const gltfFile = res.data.data[0];
          if (gltfFile?.gltfUrl) {
            setModelUrl(`${API_MODEL_URL}${gltfFile.gltfUrl}`);
          } else {
            setError("No GLTF file found for this product.");
          }
        } else {
          setError("No models available for this product.");
        }
      } catch (err) {
        console.error("Failed to load product models:", err);
        setError("Failed to load product models.");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [productId]);


  // Loading/Error Overlay
  if (loading) {
    return (
      <Html center>
        <div
          style={{
            color: "white",
            background: "rgba(0,0,0,0.8)",
            padding: "15px 20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "16px", marginBottom: "5px" }}>
            🔄 Loading 3D Model...
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>Please wait...</div>
        </div>
      </Html>
    );
  }

  if (error) {
    return (
      <Html center>
        <div
          style={{
            color: "white",
            background: "rgba(255,0,0,0.8)",
            padding: "15px 20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "16px", marginBottom: "5px" }}>⚠️ {error}</div>
        </div>
      </Html>
    );
  }

  if (!modelUrl) return null;

  return (
    <Suspense
      fallback={
        <Html center>
          <div
            style={{
              color: "white",
              background: "rgba(0,0,0,0.8)",
              padding: "15px 20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "16px", marginBottom: "5px" }}>
              🔄 Loading 3D Model...
            </div>
          </div>
        </Html>
      }
    >
      <Model url={modelUrl} rotation={rotation} />
    </Suspense>
  );
}
