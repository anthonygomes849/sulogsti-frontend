import Main from "../pages/Main";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = (props: Props) => {
  // const token = sessionStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);

  const token = urlParams.get("token");

  return <Main>{props.children}</Main>;
};

export default PrivateRoute;
