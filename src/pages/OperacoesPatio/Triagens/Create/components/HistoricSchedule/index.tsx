import React from "react";
import CheckMarker from "../../../../../../assets/images/checkMarker.svg";

interface ITimeline {
  id: number;
  label: string;
}

interface Props {
  data: ITimeline[];
  status: number;
}

const HistoricSchedule: React.FC<Props> = (props: Props) => {
  return (
    <div className="w-full p-3 flex items-center">
      {props.data.map((item: ITimeline) => (
        <div className="flex items-center w-auto h-full">
          <div className="flex w-max max-w-80 items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                props.status > item.id ? "bg-[#A0DBAF]" : "bg-[#FFFFFF]"
              }`}
              style={{
                border: props.status > item.id ? 'initial' :`2px solid ${
                  props.status === item.id ? "#0C4A85" : "#DBDEDF"
                }` ,
              }}
            >
              {props.status > item.id ? (
                <img src={CheckMarker} />
              ) : (
                <span
                  className={`text-sm text-[${
                    props.status === item.id ? "#0C4A85" : "#DBDEDF"
                  }] font-semibold`}
                >
                  {item.id + 1}
                </span>
              )}
            </div>
            <div className="flex items-center w-max">
              <span
                className={`${item.id === 2 ? 'text-xs' : 'text-sm'} text-[${
                  props.status === item.id ? "#000" : "#6E7880"
                }] font-semibold ml-3 mr-3 w-full`}
              >
                {item.label}
              </span>
            </div>
            {item.id <= 2 && <div className={`${props.status > item.id ? 'w-7' : 'w-10'} h-[2px] bg-[${props.status > item.id ? '#A0DBAF' : '#DBDEDF'}] mr-2`} />}
          </div>
          {/* {item.id <= 2 && (
          )} */}
        </div>
      ))}
    </div>
  );
};

export default HistoricSchedule;
