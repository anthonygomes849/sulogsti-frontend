import React from "react";
import Select, { StylesConfig } from "react-select";
import { Error } from "../InputCustom/styles";

interface Props {
  data: any[];
  onChange: (selectedOption: any) => void;
  title: string;
  touched?: any;
  error?: any;
  value?: any;
  disabled?: boolean;
  isMulti?: boolean;
}

const SelectCustom: React.FC<Props> = (props: Props) => {
  const colourStyles: StylesConfig = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      zIndex: "99999999",
    }),
    option: (styles: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: "#FFF",
        color: "#000",
      };
    },
  };

  const defaultValue = props.data.find((value: any) => value.id == props.value);

  return (
    <>
      <div>
        <h1 className="text-[15px] text-[#000] mb-4">{props.title}</h1>

        <Select
          className="basic-multi-select"
          classNamePrefix="select"
          menuPortalTarget={document.body}
          isMulti={props.isMulti}
          defaultValue={props.value}
          isDisabled={props.disabled}
          placeholder="Selecione"
          styles={colourStyles}
          name="color"
          options={props.data}
          onChange={props.onChange}
          value={defaultValue}
        />
      </div>

      {props.touched && props.error && <Error>{props.error}</Error>}
    </>
  );
};

export default SelectCustom;
