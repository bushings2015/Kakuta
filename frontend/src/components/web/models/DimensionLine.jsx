
import {  Text, Line } from "@react-three/drei";
import * as THREE from "three";

export default function DimensionLine({ start, end, label, offset = [0, 0, 0] }) {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ];
  
  const midPoint = new THREE.Vector3()
    .addVectors(points[0], points[1])
    .multiplyScalar(0.5)
    .add(new THREE.Vector3(...offset));
  
  return (
    <group>
      <Line
        points={points}
        color="#00ff00"
        lineWidth={2}
        dashed={false}
      />
      <Text
        position={midPoint}
        fontSize={0.1}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}