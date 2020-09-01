import styled, { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-spacing: 0px;
  background-color: rgb(255, 255, 255, 0.025);
  margin-bottom: 45px;

  td, th {
    padding: 13px;
    border-right: 2px solid rgb(255, 255, 255, 0.033);

    &:last-child {
      border: 0;
    }

    &.action {
      width: 20px;
      text-align: center;
    }
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background-color: rgb(255, 255, 255, 0.03);
      }
    }
    
    td.action {
      cursor: pointer;
      &:hover {
        color: #DDD;
      }
    }

    a {
      color: white;
      
      &:hover {
        color: #DDD;
      }
    }
  }
`;
 
export default GlobalStyle;