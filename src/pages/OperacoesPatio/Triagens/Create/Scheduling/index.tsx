import React, { useCallback } from "react";
import { useStatus } from "../../../../../hooks/StatusContext";
import Associate from "./components/Associate";
import IdentifyDriver from "./components/IdentifyDriver";
import IdentifyVehicle from "./components/IdentifyVehicle";
import Invoiced from "./components/Invocied";
import Payment from "./components/Payment";

// import { Container } from './styles';
interface Props {
  onClose: () => void;
}

const Scheduling: React.FC<Props> = (props: Props) => {

  const { status } = useStatus();

  const onRenderPageByStatus = useCallback((status: number) => {
    switch (status) {
      case 0:
        return (
          <Associate
          />
        );
        break;
      case 1:
        return <IdentifyDriver />;
        break;
      case 2:
        return <IdentifyVehicle />;
      case 3:
        return <Payment onClose={props.onClose} />;
      case 4:
        return <Invoiced onClose={props.onClose} />
      default:
        break;
    }
  }, [status]);

  return <>{onRenderPageByStatus(status)}</>;
};

export default Scheduling;
