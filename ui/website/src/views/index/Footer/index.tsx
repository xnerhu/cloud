import React from 'react';
import { IconButtonProps, IconProps } from '@wexond/ui';

import { ICON_DISCORD, ICON_GITHUB, ICON_TWITTER } from 'constants/icons';
import { Socials, StyledFooter, StyledSocial } from './style';

const Social: React.FC<{ href: string } & IconButtonProps> = ({
  href,
  ...props
}) => {
  return (
    <a href={href}>
      <StyledSocial {...props} iconSize="24px" autoInvert />
    </a>
  );
};

Social.defaultProps = {
  iconSize: '100%',
};

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Socials>
        <Social
          aria-label="Github"
          href="https://github.com/wexond"
          icon={ICON_GITHUB}
        />
        <Social
          aria-label="Discord"
          href="https://discord.gg/P7Vn4VX"
          icon={ICON_DISCORD}
        />
        <Social
          aria-label="Twitter"
          href="https://twitter.com/wexond"
          icon={ICON_TWITTER}
        />
      </Socials>
      Copyright &copy; Wexond 2021
    </StyledFooter>
  );
};
