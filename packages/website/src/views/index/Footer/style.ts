import styled from 'styled-components';
import { Icon, IconButton, StyledIcon } from '@wexond/ui';

import { interRegular } from 'mixins/typography';

export const StyledFooter = styled.footer`
  width: 100%;
  background-color: rgb(15, 15, 15);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.36);
  font-size: 14px;
  padding-bottom: 24px;
  ${interRegular};
`;

export const Socials = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 16px;
`;

export const StyledSocial = styled(IconButton)`
  width: 48px;
  height: 48px;

  & > ${StyledIcon} {
    opacity: 0.5;
    transition: 0.2s opacity;
  }

  &:hover > ${StyledIcon} {
    opacity: 1;
  }
`;
