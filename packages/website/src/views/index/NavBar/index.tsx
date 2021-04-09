import { Icon } from '@wexond/ui';
import { ICON_LOGO_WHITE } from 'constants/icons';
import React from 'react';

import { StyledNavBar, Container, Title } from './style';

export const NavBar: React.FC = () => {
  return (
    <StyledNavBar>
      <Container>
        <Icon src={ICON_LOGO_WHITE} boxSize="56px" iconSize="100%" />
        <Title>Wexond</Title>
      </Container>
    </StyledNavBar>
  );
};
