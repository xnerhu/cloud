import styled from 'styled-components';
import { centerIcon } from '@wexond/ui';

import { ICON_LOGO } from 'constants/icons';
import { NAVBAR_HEIGHT } from 'constants/design';

export const Container = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  height: calc(100vh - ${NAVBAR_HEIGHT}px);
  display: flex;
  align-items: center;
`;
