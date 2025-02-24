import React from 'react';

interface ChoiceData {
  id: number;
  label: string;
  icon?: string;
}

interface Props {
  data: ChoiceData[];
  value: string;
  onChange: (value: number) => void;
}

const ChoiceBox: React.FC<Props> = (props: Props) => {
  return (
    <div className='flex w-full items-center'>
      {props.data.map((item: ChoiceData) => (
        <div className={`flex items-center w-max h-8 p-3 rounded-2xl bg-[${item.id === Number(props.value) ? '#0A4984' : '#FFFFFF'}] mt-4 mr-3 cursor-pointer`} style={{  border: '1px solid #BBB9B9' }} onClick={() => props.onChange(item.id)}>
          <img src={item.icon} className='mr-2' />
          <span className={`text-sm`} style={{ color: item.id === Number(props.value) ? '#DBDEDF': '#000' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default ChoiceBox;