import styled from 'styled-components';
import { singleLine, gradientText, noUserSelect } from '@wexond/ui';

import { NAVBAR_HEIGHT, NAVBAR_MARGIN_TOP } from 'constants/design';
import { interBold, interRegular } from 'mixins/typography';
import { COLOR_PRIMARY, COLOR_SECONDARY } from 'constants/colors';
import {
  BREAKPOINT_FULL,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
} from 'constants/breakpoints';

export const Container = styled.div`
  width: 100%;
  position: relative;
`;

export const StyledLanding = styled.div`
  width: 100%;
  max-width: ${BREAKPOINT_FULL}px;
  margin: 0 auto;
  height: calc(100vh - ${NAVBAR_HEIGHT + NAVBAR_MARGIN_TOP}px);
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
  position: relative;
  z-index: 2;
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
  background-image: linear-gradient(
    90deg,
    ${COLOR_PRIMARY} 0%,
    ${COLOR_SECONDARY} 70%
  );
  ${gradientText};
`;

export const Circle = styled.div`
  position: absolute;
  z-index: 0;
  background-color: #0085ff;
  opacity: 0.3;
  width: 60vw;
  height: 60vw;
  border-radius: 50%;
  filter: blur(18vw);
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 32px;
`;

export const WaitlistButton = styled.a`
  width: fit-content;
  font-size: 16px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 24px;
  letter-spacing: 1px;
  cursor: pointer;
  will-change: background-color, color;
  transition: 0.15s background-color, 0.15s color;
  ${noUserSelect};
  ${interBold};
  text-decoration: none;
  color: #000;
  border: 2px solid transparent;

  &:hover {
    background-color: ${COLOR_SECONDARY};
    color: #000;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 14px;
    padding: 16px 12px;
  }
`;

export const OutlinedButton = styled(WaitlistButton)`
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  margin-left: 16px;

  &:hover {
    border: 2px solid transparent;
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
  letter-spacing: 4px;
  text-align: center;
  padding: 0px 16px;
  ${interRegular};

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 24px;
  }
`;
