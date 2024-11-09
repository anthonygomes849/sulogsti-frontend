import React from 'react';
import Badge from '../../../Badge';

// import { Container } from './styles';
export interface StatusType {
  id: number;
  label: string;
  color: string;
}

interface Props {
  data: StatusType[];
  status: number
}

const Status: React.FC<Props> = ({ data, status }: Props) => {

  return (
    <Badge content={data.find((item: StatusType) => item.id === status)?.label} color={data.find((item: StatusType) => item.id === status)?.color} />
  );
}

export default Status;