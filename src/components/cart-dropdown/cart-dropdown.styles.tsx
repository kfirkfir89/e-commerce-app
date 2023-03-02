import styled from 'styled-components';

import {
  BaseButton,
  GoogleSignInButton,
  InvertedButton,
  DefaultButton,
} from '../button/button.styles';

export const CartDropdownContainer = styled.div`
  width: 240px;
  height: 340px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid black;
  background-color: white;
  top: 90px;
  right: 40px;
  z-index: 5;

  
  ${BaseButton},
  ${GoogleSignInButton},
  ${InvertedButton},
  ${DefaultButton} {
    margin-top: auto;
  }
   
`;

export const EmptyMessage = styled.span`
  font-size: 18px;
  margin: 50px auto;
`;

export const CartItems = styled.span`
  height: 340px;
  display: flex;
  flex-direction: column;
  overflow-y:auto ;
`;
