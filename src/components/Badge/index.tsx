import React from "react";

interface Props {
  color?: string;
  icon?: string;
  content?: string;
}

const Badge: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex w-full h-full items-center justify-start">
      <div
        className={`flex flex-nowrap items-center justify-center pl-2 pr-2 w-full h-7 rounded-md bg-opacity-10`}
        style={{ backgroundColor: `${props.color}`, }}
      >
        <div className={`w-3 h-3 rounded-full mr-2`} style={{ border: '2px solid #FFF', backgroundColor: `${props.icon}` }} />
        <span className="text-[#fff] text-xs max-w-40 overflow-hidden text-ellipsis">{props.content}</span>
      </div>
    </div>
  );
};

export default Badge;
