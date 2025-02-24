import React from "react";
import Select, { StylesConfig } from "react-select";
import { Error } from "../InputCustom/styles";

interface Props {
  data: any[];
  onChange: (selectedOption: any) => void;
  onInputChange?: (value: string) => void;
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
      borderRadius: "2.313rem"
    }),
    option: (styles: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: "#FFF",
        fontSize: '0.820rem',
        fontFamily: 'Poppins',
        fontWeight: 400,
        color: "#000",
      };
    },
  };

  const defaultValue = props.data.find((item: any) => item.value == props.value);

  return (
    <>
      <div>
        <h1 className="text-sm font-semibold text-[#000] mb-2">{props.title}</h1>

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
          onInputChange={props.onInputChange}
          value={defaultValue}
        />
      </div>

      {props.touched && props.error && <Error>{props.error}</Error>}
    </>
  );
};

export default SelectCustom;
