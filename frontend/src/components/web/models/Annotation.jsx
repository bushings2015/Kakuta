
import { Html, } from "@react-three/drei";

export default function Annotation({ position, text, color = "#00ff00" }) {
  return (
    <group position={position}>
      <Html>
        <div className="annotation" style={{
          background: 'rgba(0,0,0,0.8)',
          color: color,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          border: `1px solid ${color}`,
          pointerEvents: 'none'
        }}>
          {text}
        </div>
      </Html>
    </group>
  );
}