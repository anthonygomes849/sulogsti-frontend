import React from "react";

interface Props {
  color?: string;
  icon?: string;
  content?: string;
}

const Badge: React.FC<Props> = (props: Props) => {
  console.log(props.icon);
  return (
    <div className="flex w-full h-full items-center justify-start">
      <div
        className={`flex items-center justify-center min-w-16 pl-2 pr-2 h-7 rounded-md bg-opacity-10`}
        style={{ backgroundColor: `${props.color}`, }}
      >
        <div className={`w-3 h-3 rounded-full mr-2`} style={{ border: '2px solid #FFF', backgroundColor: `${props.icon}` }} />
        <span className="text-[#fff]">{props.content}</span>
      </div>
    </div>
  );
};

export default Badge;
