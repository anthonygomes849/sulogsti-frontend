import { motion } from "framer-motion";
import React from "react";
import closeModalIcon from "../../assets/images/closeIconInfo.svg";

interface Props {
  isOpen: boolean;
  title: string;
  children: JSX.Element;
  onClose: () => void;
}

const ModalSideBar: React.FC<Props> = (props: Props) => {
  return (
    <div className="relative">
      <div className="fixed inset-0 z-40 bg-black/50"></div>

      <motion.div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-full max-w-[600px] rounded-sm`}
        initial={{ x: "100%" }}
        animate={{ x: props.isOpen ? 0 : "100%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="relative flex justify-start items-center w-full h-10 p-2 pl-3"
          style={{ borderBottom: "1px solid #CCC" }}
        >
          <h2 className="text-sm font-medium text-[#1E2121]">
            {props.title}
          </h2>

          <img src={closeModalIcon} alt="" className="absolute right-4 top-3 cursor-pointer" onClick={props.onClose} />
        </div>

        <div className="flex items-center p-5">{props.children}</div>
      </motion.div>
    </div>
  );
};

export default ModalSideBar;
