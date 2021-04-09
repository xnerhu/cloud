import React from 'react';

import {
  StyledBrowser,
  StyledWindowControls,
  WindowControl,
  Cards,
  DockContainer,
  StyledDock,
  Tab,
  Card,
  BrowserContainer,
  BlueEffect,
} from './style';

const WindowControls: React.FC = () => {
  return (
    <StyledWindowControls>
      <WindowControl />
      <WindowControl />
      <WindowControl />
    </StyledWindowControls>
  );
};

const Dock: React.FC = () => {
  return (
    <DockContainer>
      <StyledDock>
        <Tab />
        <Tab />
        <Tab />
      </StyledDock>
    </DockContainer>
  );
};

export const Browser: React.FC = () => {
  return (
    <BrowserContainer>
      <StyledBrowser>
        <WindowControls />
        <Dock />
        <Cards>
          <Card />
          <Card />
        </Cards>
      </StyledBrowser>
      <BlueEffect />
    </BrowserContainer>
  );
};
