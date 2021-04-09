import React from 'react';
import { Icon, isClientWeb } from '@wexond/ui';

import { ICON_LOGO_WHITE } from 'constants/icons';
import { StyledNavBar, Container, Title, LogoContainer } from './style';

export const NavBar: React.FC = () => {
  const [isSticky, setSticky] = React.useState(false);

  const onWindowScroll = React.useCallback(() => {
    const sticky = window.scrollY > 0;

    if (isSticky !== sticky) {
      setSticky(sticky);
    }
  }, [isSticky]);

  React.useEffect(() => {
    if (isClientWeb) {
      window.addEventListener('scroll', onWindowScroll);
    }

    return () => {
      if (isClientWeb) {
        window.removeEventListener('scroll', onWindowScroll);
      }
    };
  }, [isSticky]);

  return (
    <StyledNavBar isSticky={isSticky}>
      <Container>
        <LogoContainer href="/">
          <Icon src={ICON_LOGO_WHITE} boxSize="56px" iconSize="100%" />
          <Title>Wexond</Title>
        </LogoContainer>
      </Container>
    </StyledNavBar>
  );
};
