import React from "react";
import { AuthenticateProvider } from "../hooks/AuthenticateContext";
import { PermissionProvider } from "../hooks/PermissionContext";
import Main from "../pages/Main";

// import { Container } from './styles';

interface Props {
  children: JSX.Element;
}

const Route: React.FC<Props> = (props: Props) => {
  return (
    <PermissionProvider>

    <Main>
      <AuthenticateProvider>{props.children}</AuthenticateProvider>
    </Main>
    </PermissionProvider>
  );
};

export default Route;
