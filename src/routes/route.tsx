import React from "react";
import Main from "../pages/Main";

// import { Container } from './styles';

interface Props {
  children: JSX.Element;
}

const Route: React.FC<Props> = (props: Props) => {
  return (

    <Main>
      {props.children}
      {/* <AuthenticateProvider>{props.children}</AuthenticateProvider> */}
    </Main>
  );
};

export default Route;
