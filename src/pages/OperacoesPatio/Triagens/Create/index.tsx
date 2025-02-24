import React from "react";
import CustomModal from "../../../../components/CustomModal";
import { useStatus } from "../../../../hooks/StatusContext";
import { ITriagens } from "../types/types";
import Scheduling from "./Scheduling";
import HistoricSchedule from "./components/HistoricSchedule";
import { listTimeline } from "./components/HistoricSchedule/timeline";

// import { Container } from './styles';

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  onClear: () => void;
  onConfirm: () => void;
  selectedRow?: ITriagens;
}

const Create: React.FC<Props> = (props: Props) => {
  const { status } = useStatus();

  return (
      <CustomModal
        isScreenLg
        onClose={props.onClear}
        header={<HistoricSchedule data={listTimeline} status={status} />}
      >
        <Scheduling />
      </CustomModal>
  );
};

export default Create;
