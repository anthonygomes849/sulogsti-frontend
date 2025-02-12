import { Navigate } from "react-router-dom";
import Main from "../pages/Main";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = (props: Props) => {
  const urlParams = new URLSearchParams(window.location.search);

  const token = urlParams.get("token");

  return token ? (
    <Main>
      {props.children}
    </Main>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
