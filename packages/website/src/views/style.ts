import { interRegular } from 'mixins/typography';
import { createGlobalStyle } from 'styled-components';

export const UIStyle = createGlobalStyle`
  body {
    width: 100%;
    height: 100%;
    cursor: default;
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    ${interRegular};
  }

  * {
    box-sizing: border-box;
  }
`;
