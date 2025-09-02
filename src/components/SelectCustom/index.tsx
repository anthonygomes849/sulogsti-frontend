import React from "react";
import Select, { StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
import { Error } from "../InputCustom/styles";
import {Options} from "../../pages/Cadastro/Terminal/Create/types/types.ts";

interface Props {
  data: any;
  onChange: (selectedOption: any) => void;
  onInputChange?: (value: string) => void;
  title: string;
  name?: string;
  touched?: any;
  error?: any;
  value?: any;
  disabled?: boolean;
  isMulti?: boolean;
  selectRef?: any;
  async?: boolean;
  defaultValue?: any;
  dataTestid?: string;
}

const SelectCustom: React.FC<Props> = (props: Props) => {
  const colourStyles: StylesConfig = {
    menuPortal: (base) => ({ ...base, zIndex: 999999 }),
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      zIndex: "9999999px",
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

  const defaultValue = !props.async && !props.isMulti
    ? props.data.find((item: Options) => item.value == props.value)
    : props.defaultValue;

  return (
    <>
      <div className="w-full">
        <label htmlFor={props.name} className="text-sm font-semibold text-[#000] mb-2">
          {props.title}
        </label>

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
            name={props.name || "color"}
            inputId={props.name}
            loadOptions={props.data}
            onChange={props.onChange}
            onInputChange={props.onInputChange}
            value={defaultValue}
            openMenuOnFocus={true} // Abre o menu quando o select recebe foco
            isSearchable={true} // Permite digitação
            data-testid={props.dataTestid}
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
            inputId={props.name}
            styles={colourStyles}
            name={props.name || "color"}
            options={props.data}
            onChange={props.onChange}
            onInputChange={props.onInputChange}
            value={defaultValue}
            openMenuOnFocus={true} // Abre o menu quando o select recebe foco
            isSearchable={true} // Permite digitação
            data-testid={props.dataTestid}
          />
        )}
      </div>

      {props.touched && props.error && <Error>{props.error}</Error>}
    </>
  );
};

export default SelectCustom;
