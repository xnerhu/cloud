import { interRegular } from 'mixins/typography';
import { createGlobalStyle } from 'styled-components';

export const UIStyle = createGlobalStyle`
  html, body {
    width: 100%;
    overflow-x: hidden;
  }

  body {
    height: 100%;
    cursor: default;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    position: relative;
    ${interRegular};
  }

  * {
    box-sizing: border-box;
  }
`;
