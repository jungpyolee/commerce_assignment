import { Button, f7ready, Navbar, Page, Swiper, SwiperSlide, Toolbar } from 'framework7-react';
import { sampleSize, zip } from 'lodash';
import React, { useEffect, useState } from 'react';
import sanitizeHtml from '../js/utils/sanitizeHtml';

const IntroPage = (props) => {
  return (
    <Page>
      <Navbar className="hidden" />
      <Toolbar bottom className="p-0" inner={false}>
        <div className="w-full flex">
          <Button className="w-full rounded-none" large href="/users/sign_in">
            로그인
          </Button>
          <Button className="w-full rounded-none" large href="/users/sign_up" fill>
            회원가입
          </Button>
        </div>
      </Toolbar>{' '}
    </Page>
  );
};
export default React.memo(IntroPage);
