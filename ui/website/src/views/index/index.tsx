import React from 'react';

import { NavBar } from './NavBar';
import { Browser } from './Browser';
import {
  StyledLanding,
  Hero,
  SubTitle,
  Title,
  WaitlistButton,
  StyledComing,
  ComingHeader,
  Circle,
  Buttons,
  OutlinedButton,
  Container,
} from './style';
import { Footer } from './Footer';
import { COLOR_PRIMARY } from 'constants/colors';

const Landing: React.FC = () => {
  return (
    <Container>
      <StyledLanding>
        {/* <Circle style={{ left: '-10%', top: '-15%'}}></Circle> */}
        <Circle
          style={{
            background: COLOR_PRIMARY,
            top: '20%',
            right: '0',
            transform: 'translateX(10vw)',
          }}
        />
        {/* <Circle style={{top: '70vh', background: '#00FFF0', left: '10%', width: '40vw', height: '40vw', opacity: 0.2}}></Circle> */}
        <Hero>
          <Title>web browser.</Title>
          <SubTitle>redefined.</SubTitle>
          <Buttons>
            <WaitlistButton href="https://wexond.net/waitlist">
              JOIN THE WAITLIST
            </WaitlistButton>
            <OutlinedButton href="https://twitter.com/wexond">
              FOLLOW US
            </OutlinedButton>
          </Buttons>
        </Hero>
        <Browser />
      </StyledLanding>
    </Container>
  );
};

const Coming: React.FC = () => {
  return (
    <StyledComing>
      <ComingHeader>COMING THIS YEAR</ComingHeader>
    </StyledComing>
  );
};

const Index = () => {
  return (
    <>
      <NavBar />
      <Landing />
      <Coming />
      <Footer />
    </>
  );
};

export default Index;
