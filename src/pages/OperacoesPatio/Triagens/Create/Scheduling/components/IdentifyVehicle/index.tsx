import { motion } from "framer-motion";
import React from "react";

// import { Container } from './styles';

const IdentifyVehicle: React.FC = () => {
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="page"
    >
      <div className="overflow-y-scroll max-h-[650px] p-5">
        {/* Insert Code here */}
      </div>
    </motion.div>
  );
};

export default IdentifyVehicle;
