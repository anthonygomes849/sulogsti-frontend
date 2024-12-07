// import hidePasswordIcon from 'assets/images/hidePasswordIcon.png';
// import showPasswordIcon from 'assets/images/showPasswordIcon.png';
import React from 'react';
// import CustomTooltip from './CustomTooltip';
import { Error, InputForm, InputMask, Title } from './styles';

interface InputProps {
  title?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  className?: any;
  typeInput?: string;
  style?: any;
  styleTitle?: any;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  mask?: any;
  messageTooltip?: JSX.Element;
  isTooltip?: boolean;
  placeholder: string;
  type?: any;
  touched?: any;
  error?: any;
  value?: any;
}

const InputCustom: React.FC<InputProps> = (
  {
    title,
    type,
    mask,
    touched,
    style,
    error,
    placeholder,
    autoComplete,
    onChange,
    onBlur,
    typeInput,
    styleTitle,
    value,
    id,
    disabled,
  }: InputProps,
  ...rest
) => {
  const Input =
    typeInput === 'mask' ? InputMask : (InputForm as React.ElementType);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Title style={styleTitle}>{title}</Title>
      </div>
      <div className="tw-relative">

        <Input
          {...rest}
          type={type || "text"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          style={style}
          value={value}
          mask={mask}
          id={id}
          onBlur={onBlur}
          disabled={disabled}
          formatChars={{ '9': '[0-9]', 'a': '[A-Za-z]', '*': '[0-9A-Za-z]' }} // Aceita letras e números após a terceira letra

          {...rest}
        />
      </div>

      {touched && error && <Error>{error}</Error>}
    </>
  );
};

export default InputCustom;
