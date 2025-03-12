import { motion } from "framer-motion";
import React from "react";
import CheckMarker from "../../../../../../../assets/images/checkMarker.svg";
// import { Container } from './styles';

interface Props {
  onClose: () => void;
}

const Invoiced: React.FC<Props> = (props: Props) => {
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };
  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <div className="overflow-y-scroll max-h-[650px] p-10">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center h-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${"bg-[#006400]"}`}
              >
                <img src={CheckMarker} />
              </div>
              <span className="ml-4 text-base text-[#000] font-bold">Triagem faturada com sucesso!</span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          onClick={() => props.onClose()}
        >
          Finalizar
        </button>
      </div>
    </>
  );
};

export default Invoiced;
