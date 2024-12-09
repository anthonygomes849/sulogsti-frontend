import React from "react";
import SubNav from "../../components/SubNav";
import { BreadcrumbProvider } from "../../hooks/BreadCrumbContext";
import { ModalProvider } from "../../hooks/ModalContext";

// import { Container } from './styles';

interface Props {
  children: JSX.Element;
}

const Main: React.FC<Props> = (props: Props) => {
  console.log(window.location.pathname);
  return (
    <div className="flex flex-col">
        <ModalProvider>
          <BreadcrumbProvider>
            <div>
              <SubNav
                isVisibleActions={
                  !window.location.pathname.includes("adicionar")
                }
              />
            </div>
            {props.children}
          </BreadcrumbProvider>
        </ModalProvider>
    </div>
  );
};

export default Main;
