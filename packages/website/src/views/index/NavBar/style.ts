import styled from 'styled-components';

import { BREAKPOINT_NAVBAR } from 'constants/breakpoints';
import { NAVBAR_HEIGHT } from 'constants/design';
import { interMedium } from 'mixins/typography';
import { noUserSelect } from '@wexond/ui';

export const StyledNavBar = styled.div`
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  position: sticky;
  top: 0;
`;

export const Container = styled.div`
  width: 100%;
  max-width: ${BREAKPOINT_NAVBAR}px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

export const Title = styled.span`
  font-size: 18px;
  margin-left: 12px;
  ${noUserSelect};
  ${interMedium};
`;
