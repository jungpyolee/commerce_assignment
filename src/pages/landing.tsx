import React from 'react';
import { Page } from 'framework7-react';
import logo from '../assets/images/logo.png';

const LandingPage = () => (
  <Page>
    <div className="w-full h-screen flex justify-center items-center">
      <img src={logo} alt="logo" className="w-full h-auto" />
    </div>
  </Page>
);

export default LandingPage;
