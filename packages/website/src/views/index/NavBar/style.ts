import styled, { css } from 'styled-components';

import { BREAKPOINT_CONTENT } from 'constants/breakpoints';
import { NAVBAR_HEIGHT } from 'constants/design';
import { interBold } from 'mixins/typography';
import { noUserSelect } from '@wexond/ui';

export const StyledNavBar = styled.nav`
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  position: sticky;
  top: 0;
  z-index: 10;
  border: 1px solid transparent;
  background-color: rgba(0, 0, 0, 0.48);
  transition-property: 0.15s border-bottom;
  backdrop-filter: blur(16px);

  ${({ isSticky }: { isSticky?: boolean }) =>
    isSticky &&
    css`
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `}
`;

export const Container = styled.div`
  width: 100%;
  max-width: ${BREAKPOINT_CONTENT}px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

export const Title = styled.span`
  font-size: 18px;
  margin-left: 12px;
  ${noUserSelect};
  ${interBold};
`;
