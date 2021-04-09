import styled from 'styled-components';

import {
  DOCK_CONTAINER_WIDTH,
  DOCK_MARGIN_TOP,
  DOCK_TAB_BUBBLE_SIZE,
  DOCK_TAB_HEIGHT,
  DOCK_WIDTH,
  NAVBAR_HEIGHT,
} from 'constants/design';
import { centerBoth, centerHorizontal } from '@wexond/ui';
import { COLOR_PRIMARY, COLOR_SECONDARY } from 'constants/colors';
import { BREAKPOINT_FULL, BREAKPOINT_MEDIUM } from 'constants/breakpoints';

export const BrowserContainer = styled.div`
  width: 740px;
  height: calc(100vh - ${NAVBAR_HEIGHT}px);
  border-radius: 12px;
  position: absolute;
  right: -64px;
  margin-top: 24px;
  padding: 4px;
  background: conic-gradient(
    from -39.31deg at 58.46% 54.64%,
    ${COLOR_PRIMARY} -50.27deg,
    ${COLOR_SECONDARY} 0.49deg,
    #278cd6 57.03deg,
    ${COLOR_PRIMARY} 309.73deg,
    ${COLOR_SECONDARY} 360.49deg
  );

  @media (min-width: ${BREAKPOINT_MEDIUM +
    1}px) and (max-width: ${BREAKPOINT_FULL}px) {
    width: 500px;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    width: calc(100% - 64px);
    right: unset;
    position: relative;
    margin-top: 64px;
    height: 50vh;
  }
`;

export const StyledBrowser = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgb(20, 20, 20);
`;

export const StyledWindowControls = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  position: absolute;
  top: 15px;
  left: 15px;
`;

export const WindowControl = styled.div`
  width: 11px;
  height: 11px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 100%;
`;

export const DockContainer = styled.div`
  width: ${DOCK_CONTAINER_WIDTH}px;
  position: absolute;
  top: ${DOCK_MARGIN_TOP}px;
`;

export const StyledDock = styled.div`
  width: ${DOCK_WIDTH}px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 3px 0px;
  ${centerHorizontal};
  position: relative;
`;

export const Tab = styled.div`
  width: 100%;
  height: ${DOCK_TAB_HEIGHT}px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: ${DOCK_TAB_BUBBLE_SIZE}px;
    height: ${DOCK_TAB_BUBBLE_SIZE}px;
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 100%;
    position: relative;
    ${centerBoth};
  }
`;

export const Cards = styled.div`
  width: calc(100% - ${DOCK_CONTAINER_WIDTH}px);
  height: 100%;
  display: flex;
  margin-left: ${DOCK_CONTAINER_WIDTH}px;
  padding-top: ${DOCK_MARGIN_TOP}px;
  padding-bottom: 8px;
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  margin-right: 12px;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    display: block;
    width: 100%;
  }

  &::before {
    height: 36px;
    background-color: rgba(255, 255, 255, 0.12);
  }

  &::after {
    height: calc(100% - 36px);
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

export const BlueEffect = styled.div`
  width: 100%;
  height: 100%;
  top: -16px;
  right: 32px;
  position: absolute;
  background: rgba(39, 140, 214, 0.12);
  filter: blur(128px);
`;
