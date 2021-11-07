import { Button, Navbar, Page, Toolbar } from 'framework7-react';
import React from 'react';

const IntroPage = () => {
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
      </Toolbar>
    </Page>
  );
};
export default React.memo(IntroPage);
