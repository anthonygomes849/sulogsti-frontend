import React from "react";
import Select, { StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
import { Error } from "../InputCustom/styles";

interface Props {
  data: any;
  onChange: (selectedOption: any) => void;
  onInputChange?: (value: string) => void;
  title: string;
  touched?: any;
  error?: any;
  value?: any;
  disabled?: boolean;
  isMulti?: boolean;
  selectRef?: any;
  async?: boolean;
  defaultValue?: any;
}

const SelectCustom: React.FC<Props> = (props: Props) => {
  const colourStyles: StylesConfig = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      zIndex: "99999999",
      borderRadius: "2.313rem",
    }),
    option: (styles: any, state: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: state.isDisabled ? "#CCC" : "#FFF",
        fontSize: "0.820rem",
        fontFamily: "Poppins",
        fontWeight: 400,
        color: "#000",
      };
    },
  };

  const defaultValue = !props.async
    ? props.data.find((item: any) => item.value == props.value)
    : props.defaultValue;

  return (
    <>
      <div className="w-full">
        <h1 className="text-sm font-semibold text-[#000] mb-2">
          {props.title}
        </h1>

        {props.async ? (
          <AsyncSelect
            ref={props.selectRef}
            className="basic-multi-select"
            classNamePrefix="select"
            menuPortalTarget={document.body}
            isMulti={props.isMulti}
            defaultValue={props.defaultValue}
            isDisabled={props.disabled}
            placeholder="Selecione"
            styles={colourStyles}
            name="color"
            loadOptions={props.data}
            onChange={props.onChange}
            onInputChange={props.onInputChange}
            value={defaultValue}
            openMenuOnFocus={true} // Abre o menu quando o select recebe foco
            isSearchable={true} // Permite digitação
          />
        ) : (
          <Select
            ref={props.selectRef}
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
            openMenuOnFocus={true} // Abre o menu quando o select recebe foco
            isSearchable={true} // Permite digitação
          />
        )}
      </div>

      {props.touched && props.error && <Error>{props.error}</Error>}
    </>
  );
};

export default SelectCustom;
