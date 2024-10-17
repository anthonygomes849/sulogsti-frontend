import React from 'react';
import Select, { StylesConfig } from 'react-select';

interface Props {
  data: any[];
  onChange: () => void;
  title: string;
}

const SelectCustom: React.FC<Props> = (props: Props) => {

  const colourStyles: StylesConfig = {
    control: (styles: any, { isFocused }) => ({ ...styles, backgroundColor: 'white', border: isFocused && '1px solid #edb20e' }),
    option: (styles: any, { isFocused }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused ? '#f9c100'  :'#fff',
        color: '#000',
        ':active': {
          ...styles['active'],
          backgroundColor: '#edb20e'
        }
      };
    },
    // input: (styles) => ({ ...styles, ...dot() }),
    // placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    // singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };


  
  return (
    <div>
      <h1 className='text-[15px] text-[#000] mb-3'>{props.title}</h1>

    <Select 
      className='basic-single'
      classNamePrefix="select"
      defaultValue={props.data[0]}
      // isDisabled={isDisabled}
      // isLoading={isLoading}
      // isClearable={isClearable}
      // isRtl={isRtl}
      // isSearchable={isSearchable}
      styles={colourStyles}
      name="color"
      options={props.data}
      />
      </div>
  );
}

export default SelectCustom;