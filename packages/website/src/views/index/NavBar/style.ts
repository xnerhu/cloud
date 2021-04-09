import styled, { css } from 'styled-components';

import { BREAKPOINT_FULL, BREAKPOINT_MEDIUM } from 'constants/breakpoints';
import { NAVBAR_HEIGHT, NAVIGATION_MARGIN_TOP } from 'constants/design';
import { interBold } from 'mixins/typography';
import { noUserSelect } from '@wexond/ui';



export const StyledNavBar = styled.nav`
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  position: sticky;
  top: 0;
  z-index: 10;
  border: 1px solid transparent;
  margin-top: ${NAVIGATION_MARGIN_TOP}px;
  transition-property: 0.15s border-bottom;
  backdrop-filter: blur(16px);

  ${({ isSticky }: { isSticky?: boolean }) =>
    isSticky &&
    css`
      backdrop-filter: blur(16px);
      background-color: rgba(0, 0, 0, 0.48);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `}
`;

export const Container = styled.div`
  width: 100%;
  max-width: ${BREAKPOINT_FULL}px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;

  @media (min-width: ${BREAKPOINT_MEDIUM +
    1}px) and (max-width: ${BREAKPOINT_FULL}px) {
    max-width: ${BREAKPOINT_MEDIUM}px;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    max-width: 100%;
    padding: 0px 32px;
  }
`;

export const LogoContainer = styled.a`
  text-decoration: none;
  display: flex;
  color: #fff;
  align-items: center;
`;

export const Title = styled.span`
  font-size: 18px;
  margin-left: 12px;
  ${noUserSelect};
  ${interBold};
`;
