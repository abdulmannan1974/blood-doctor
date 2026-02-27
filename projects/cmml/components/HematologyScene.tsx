import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

const BloodCell = ({ position, color, scale = 1, distort = 0.3 }: { position: [number, number, number]; color: string; scale?: number; distort?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.15;
      ref.current.rotation.x = t * 0.2;
      ref.current.rotation.z = t * 0.1;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 32, 32]} position={position} scale={scale}>
      <meshPhysicalMaterial
        color={color}
        envMapIntensity={0.5}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        metalness={0.1}
        roughness={0.4}
        transmission={0.2}
        thickness={0.5}
      />
    </Sphere>
  );
};

const Monocyte = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = t * 0.3;
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
  });

  return (
    <group position={position}>
        {/* Irregular Nucleus */}
        <Sphere args={[0.6, 32, 32]} scale={[1.2, 0.8, 1]}>
            <meshStandardMaterial color="#312e81" emissive="#1e1b4b" emissiveIntensity={0.2} />
        </Sphere>
        {/* Cell body */}
        <Sphere ref={ref} args={[1, 32, 32]} scale={[1.5, 1.3, 1.4]}>
            <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.3} wireframe={false} transmission={0.9} thickness={0.5} />
        </Sphere>
    </group>
  );
}

export const HematologyScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#991b1b" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
          {/* Main Focused Monocyte */}
          <Monocyte position={[0, 0, 0]} />
          
          {/* Background Blood Cells (Erythrocytes-style) */}
          <BloodCell position={[-3, 2, -4]} color="#b91c1c" scale={0.4} />
          <BloodCell position={[4, -1, -5]} color="#b91c1c" scale={0.35} />
          <BloodCell position={[-2, -3, -3]} color="#b91c1c" scale={0.3} />
          <BloodCell position={[5, 3, -6]} color="#b91c1c" scale={0.45} />
          <BloodCell position={[-5, 0, -2]} color="#b91c1c" scale={0.25} />
        </Float>

        <Environment preset="studio" />
        <Stars radius={50} depth={50} count={500} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
};