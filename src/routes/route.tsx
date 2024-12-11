import React from "react";
import { AuthenticateProvider } from "../hooks/AuthenticateContext";
import Main from "../pages/Main";

// import { Container } from './styles';

interface Props {
  children: JSX.Element;
}

const Route: React.FC<Props> = (props: Props) => {
  return (

    <Main>
      <AuthenticateProvider>{props.children}</AuthenticateProvider>
    </Main>
  );
};

export default Route;
