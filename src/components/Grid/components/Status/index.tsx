import React from 'react';
import Badge from '../../../Badge';

// import { Container } from './styles';
export interface StatusType {
  id: number;
  label: string;
  color: string;
  icon: string;
}

interface Props {
  data: StatusType[];
  status: number
}

const Status: React.FC<Props> = ({ data, status }: Props) => {
  console.log(status);
  console.log("FindStatus", data.find((item: StatusType) => item.id == status));

  return (
    <Badge content={data.find((item: StatusType) => item.id == status)?.label} color={data.find((item: StatusType) => item.id == status)?.color} icon={data.find((item: StatusType) => item.id === status)?.icon} />
  );
}

export default Status;