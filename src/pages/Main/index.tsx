import React from "react";
import SubNav from "../../components/SubNav";

// import { Container } from './styles';

interface Props {
  children: JSX.Element;
}

const Main: React.FC<Props> = (props: Props) => {
  console.log(window.location.pathname);
  return (
    <div className="flex flex-col">
      <div className="">
        <SubNav
          isVisibleActions={!window.location.pathname.includes("adicionar")}
        />
      </div>

      {props.children}
    </div>
  );
};

export default Main;
