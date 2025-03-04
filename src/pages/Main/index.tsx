import React from "react";
import { BreadcrumbProvider } from "../../hooks/BreadCrumbContext";
import { ModalProvider } from "../../hooks/ModalContext";
import { PermissionProvider } from "../../hooks/PermissionContext";

interface Props {
  children: JSX.Element;
}

const Main: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-col w-full">
      <PermissionProvider>
        <ModalProvider>
          <BreadcrumbProvider>
            <div>
              {/* <SubNav
                isVisibleActions={
                  !window.location.pathname.includes("adicionar")
                }
              /> */}
            </div>
            {props.children}
          </BreadcrumbProvider>
        </ModalProvider>
      </PermissionProvider>
    </div>
  );
};

export default Main;
