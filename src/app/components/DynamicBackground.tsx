import { motion } from 'framer-motion';

const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
      {/* Vibrant Purple/Pink Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 150, 0],
          y: [0, 100, 0],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
      />

      {/* Bright Cyan/Blue Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -150, 0],
          y: [0, 200, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"
      />

      {/* Warm Amber/Orange Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [100, -100, 100],
          y: [100, 400, 100],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-amber-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"
      />
      
      {/* Subtle Grid Overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div>
  );
};

export default DynamicBackground;