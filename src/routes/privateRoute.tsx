import { Navigate } from "react-router-dom";
import Main from "../pages/Main";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = (props: Props) => {

  const token = sessionStorage.getItem("token");

  return token ? (
    <Main>
      {props.children}
    </Main>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
