import React from "react";

// import { Container } from './styles';

interface Props {
  children: JSX.Element;
}

const Route: React.FC<Props> = (props: Props) => {
  return <>{props.children}</>;
};

export default Route;
