import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";
// import { MagicButton, MagicModal } from "aceternity-ui"; // Uncomment if aceternity-ui provides these

const AnimatedBox = () => (
  <motion.mesh
    initial={{ scale: 0.8, rotateY: 0 }}
    animate={{ scale: 1, rotateY: Math.PI * 2 }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
  >
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#6C63FF" />
  </motion.mesh>
);

const Magic3DInterface: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "400px", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<Html center>Loading 3D...</Html>}>
          <AnimatedBox />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      {/* Example Magic UI button and modal (uncomment if available)
      <MagicButton onClick={() => MagicModal.open("Hello Magic!")}>Magic Pop</MagicButton>
      */}
    </div>
  );
};

export default Magic3DInterface;
