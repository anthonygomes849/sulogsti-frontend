import ReactInputMask from 'react-input-mask';
import styled from 'styled-components';
// import { responsiveSize } from 'styles/responsive';


interface StyledProps {
  edit?: boolean;
  disabled?: boolean;
}

export const Title = styled.span`
  font-family: 'Poppins';
  font-size: 0.875rem;
  color: #000000;
  /* opacity: 0.6; */
  font-weight: 500;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.400rem !important;
`;

export const InputForm = styled.input`
  height: 2.5rem;
  background-color: ${({edit, disabled}: StyledProps) => edit || disabled ? '#ccc' : '#FFFFFF'};
  /* opacity: ${({edit}: StyledProps) => edit ? 0.8 : 1}; */
  border: 1px solid #DBDEDF;
  box-sizing: border-box;
  border-radius: 2.313rem;
  font-family: Poppins;
  font-size: 1rem;
  font-style: normal;
  font-weight: 300;
  outline: none;
  line-height: 1.188rem;
  color: #000000 !important;
  /* margin-top: 0.5rem; */
  padding-left: 1rem !important;
  width: 100%;

  &:focus {
    border: 1px solid #edb20e
  }

  &::-webkit-input-placeholder {
    font-weight: 300;
    font-size: 0.875rem;
    color: #454546;
  }

  .uppercase {
    text-transform: uppercase;
  }
`;

export const InputMask = styled(ReactInputMask)`
  height: 2.5rem;
  background-color: ${({edit, disabled}: StyledProps) => edit || disabled ? '#ccc' : '#FFFFFF'};
  /* opacity: ${({edit}: StyledProps) => edit ? 0.8 : 1}; */
  border: 1px solid #DBDEDF;
  box-sizing: border-box;
  border-radius: 2.313rem;
  font-family: Poppins;
  font-size: 1rem;
  font-style: normal;
  font-weight: 300;
  outline: none;
  line-height: 1.188rem;
  color: #000000 !important;
  /* margin-top: 0.5rem; */
  padding-left: 0.625rem !important;
  width: 100%;

  &:focus {
    border: 1px solid #edb20e
  }

  &::-webkit-input-placeholder {
    font-weight: 300;
    font-size: 0.875rem;
    color: #454546;
  }
`;



export const Error = styled.span`
  font-size: 0.875rem;
  color: #EA004C;
  font-weight: bold;
`;