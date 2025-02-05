import { Navigate } from "react-router-dom";
import { AuthenticateProvider } from "../hooks/AuthenticateContext";
import Main from "../pages/Main";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = (props: Props) => {
  const urlParams = new URLSearchParams(window.location.search);

  const token = urlParams.get("token");

  return token ? (
    <Main>
      <AuthenticateProvider>{props.children}</AuthenticateProvider>
    </Main>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
