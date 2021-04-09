import React from 'react';
import { Icon, isClientWeb } from '@wexond/ui';

import { ICON_LOGO_WHITE } from 'constants/icons';
import { StyledNavBar, Container, Title, LogoContainer } from './style';
import { NAVBAR_MARGIN_TOP } from 'constants/design';

export const NavBar: React.FC = () => {
  const [isSticky, setSticky] = React.useState(false);

  const onWindowScroll = React.useCallback(() => {
    const sticky = window.scrollY > NAVBAR_MARGIN_TOP;

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
