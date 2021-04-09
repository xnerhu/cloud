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
} from './style';
import { Footer } from './Footer';

const Landing: React.FC = () => {
  return (
    <StyledLanding>
      <Hero>
        <Title>web browser.</Title>
        <SubTitle>redefined.</SubTitle>
        <WaitlistButton>JOIN THE WAITLIST</WaitlistButton>
      </Hero>
      <Browser />
    </StyledLanding>
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
