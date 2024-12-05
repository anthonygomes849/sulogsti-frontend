import React from "react";
import { Label } from "reactstrap";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  title: string;
  onChange: (value: string) => void;
  value?: any;
  disabled?: boolean;
}

const RadioGroupCustom: React.FC<Props> = (props: Props) => {
  return (
    <div className="">
      <span className="text-[0.938rem] text-[#000] mb-8">{props.title}</span>
      <RadioGroup
        defaultValue={"false"}
        style={{ display: "flex", alignItems: "center", marginTop: 10 }}
        onValueChange={(value) => props.onChange(value)}
        value={props.value ? String(props.value) : "false"}
        disabled={props.disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="r1" />
          <Label htmlFor="r1">SIM</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="r2" />
          <Label htmlFor="r2">NÃO</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioGroupCustom;
