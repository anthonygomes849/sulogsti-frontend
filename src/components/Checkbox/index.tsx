import React from "react";

interface Props {
  title: string;
  checked: boolean;
  onChecked: () => void;
}

const Checkbox: React.FC<Props> = (props: Props) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChecked}
        className="hidden"
      />
      <span className="text-sm text-black font-bold">{props.title}</span>
      <div
        className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition-all 
        ${
          props.checked
            ? "bg-[#0A4984] border-[#062D4E]"
            : "bg-white border-[#062D4E]"
        }
      `}
      >
        {props.checked && (
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
