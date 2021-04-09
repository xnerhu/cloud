import styled from 'styled-components';
import { centerIcon, singleLine, gradientText, noUserSelect } from '@wexond/ui';

import { ICON_LOGO } from 'constants/icons';
import { NAVBAR_HEIGHT } from 'constants/design';
import { interBold, interRegular } from 'mixins/typography';
import { COLOR_PRIMARY, COLOR_SECONDARY } from 'constants/colors';
import { BREAKPOINT_CONTENT } from 'constants/breakpoints';

export const StyledLanding = styled.div`
  width: 100%;
  max-width: ${BREAKPOINT_CONTENT}px;
  margin: 0 auto;
  height: calc(100vh - ${NAVBAR_HEIGHT}px);
  display: flex;
  align-items: center;
`;

export const Hero = styled.header``;

export const Title = styled.div`
  font-size: 128px;
  ${singleLine};
  ${interBold};
`;

export const SubTitle = styled(Title)`
  ${gradientText};
  background-image: linear-gradient(
    180deg,
    ${COLOR_SECONDARY} 25%,
    ${COLOR_PRIMARY} 100%
  );
`;

export const WaitlistButton = styled.div`
  width: fit-content;
  font-size: 16px;
  border: 2px solid #fff;
  border-radius: 10px;
  padding: 20px 16px;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 24px;
  will-change: background-color, color;
  transition: 0.15s background-color, 0.15s color;
  ${noUserSelect};
  ${interBold};

  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

export const StyledComing = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ComingHeader = styled.header`
  font-size: 48px;
  letter-spacing: 2px;
  ${interRegular};
`;
