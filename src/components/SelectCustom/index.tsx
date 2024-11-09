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
}

const SelectCustom: React.FC<Props> = (props: Props) => {
  const colourStyles: StylesConfig = {
    control: (styles: any, { isFocused }) => ({
      ...styles,
      backgroundColor: "white",
      border: isFocused && "1px solid #edb20e",
    }),
    option: (styles: any, { isFocused }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused ? "#f9c100" : "#fff",
        color: "#000",
        ":active": {
          ...styles["active"],
          backgroundColor: "#edb20e",
        },
      };
    },
    // input: (styles) => ({ ...styles, ...dot() }),
    // placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    // singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  const defaultValue = props.data.find((value: any) => value.id == props.value);

  console.log(props.data);

  return (
    <>
      <div>
        <h1 className="text-[15px] text-[#000] mb-3">{props.title}</h1>

        <Select
          className="basic-single"
          classNamePrefix="select"
          // defaultValue={defaultValue.id}
          // isDisabled={isDisabled}
          // isLoading={isLoading}
          // isClearable={isClearable}
          // isRtl={isRtl}
          // isSearchable={isSearchable}
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
