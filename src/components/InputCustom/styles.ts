import ReactInputMask from 'react-input-mask';
import styled from 'styled-components';
// import { responsiveSize } from 'styles/responsive';


interface StyledProps {
  edit?: boolean;
  disabled?: boolean;
}

export const Title = styled.span`
  /* font-family: 'Lato'; */
  font-size: 0.938rem;
  color: #000;
  /* opacity: 0.6; */
  font-style: normal;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.400rem !important;
`;

export const InputForm = styled.input`
  height: 2.5rem;
  background-color: ${({edit, disabled}: StyledProps) => edit || disabled ? '#ccc' : '#FFFFFF'};
  /* opacity: ${({edit}: StyledProps) => edit ? 0.8 : 1}; */
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 4px;
  /* font-family: Lato; */
  font-size: 0.938rem;
  font-style: normal;
  font-weight: 300;
  line-height: 1.188rem;
  color: #454546!important;
  margin-top: 0.5rem;
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

export const InputMask = styled(ReactInputMask)`
 height: 2.5rem;
  background-color: ${({edit, disabled}: StyledProps) => edit || disabled ? '#ccc' : '#FFFFFF'};
  /* opacity: ${({edit}: StyledProps) => edit ? 0.8 : 1}; */
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 4px;
  /* font-family: Lato; */
  font-size: 0.938rem;
  font-style: normal;
  font-weight: 300;
  line-height: 1.188rem;
  color: #454546!important;
  margin-top: 0.5rem;
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