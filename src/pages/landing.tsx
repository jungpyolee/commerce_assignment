import React from 'react';
import { Page } from 'framework7-react';
import splash from '../assets/images/splash.png';

const LandingPage = () => (
  <Page>
    <div className="w-full h-screen flex justify-center items-center">
      <img src={splash} alt="insomenia-logo" className="w-full h-auto" />
    </div>
  </Page>
);

export default LandingPage;
