import styled from 'styled-components';
import { singleLine, gradientText, noUserSelect } from '@wexond/ui';

import { NAVBAR_HEIGHT } from 'constants/design';
import { interBold, interRegular } from 'mixins/typography';
import { COLOR_PRIMARY, COLOR_SECONDARY } from 'constants/colors';
import {
  BREAKPOINT_FULL,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
} from 'constants/breakpoints';

export const StyledLanding = styled.div`
  width: 100%;
  max-width: ${BREAKPOINT_FULL}px;
  margin: 0 auto;
  height: calc(100vh - ${NAVBAR_HEIGHT}px);
  display: flex;
  align-items: center;

  @media (min-width: ${BREAKPOINT_MEDIUM +
    1}px) and (max-width: ${BREAKPOINT_FULL}px) {
    max-width: ${BREAKPOINT_MEDIUM}px;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    flex-direction: column;
  }
`;

export const Hero = styled.header`
  display: flex;
  flex-direction: column;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    width: 100%;
    padding: 48px 8px;
    align-items: center;
    text-align: center;
  }
`;

export const Title = styled.div`
  font-size: 128px;
  ${singleLine};
  ${interBold};

  @media (min-width: ${BREAKPOINT_MEDIUM +
    1}px) and (max-width: ${BREAKPOINT_FULL}px) {
    font-size: 96px;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 48px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 40px;
  }
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

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 14px;
    padding: 16px 12px;
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
  text-align: center;
  padding: 0px 16px;
  ${interRegular};

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 24px;
  }
`;
