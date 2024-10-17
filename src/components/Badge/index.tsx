import React from 'react';

interface Props {
  color: string;
  content: string;
}

const Badge: React.FC<Props> = (props: Props) => {
  return (
    <div className='flex w-full h-full items-center justify-center'>

    <div className={`flex items-center justify-center min-w-14 h-6 rounded-full`} style={{ backgroundColor: `${props.color}` }}>
      <span className='text-[#fff]'>{props.content}</span>
    </div>
    </div>
  );
}

export default Badge;