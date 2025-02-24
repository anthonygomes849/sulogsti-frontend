import React, { useCallback } from "react";
import { useStatus } from "../../../../../hooks/StatusContext";
import Associate from "./components/Associate";
import IdentifyDriver from "./components/IdentifyDriver";
import IdentifyVehicle from "./components/IdentifyVehicle";

// import { Container } from './styles';

const Scheduling: React.FC = () => {

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
      default:
        break;
    }
  }, [status]);

  return <>{onRenderPageByStatus(status)}</>;
};

export default Scheduling;
