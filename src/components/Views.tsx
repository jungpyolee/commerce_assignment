import { logoutAPI } from '@api';
import CustomPanel from '@components/shared/CustomPanel';
import useAuth from '@hooks/useAuth';
import LandingPage from '@pages/landing';
import { Auth } from 'aws-amplify';
import { Link, Toolbar, View, Views } from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';

const F7Views = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { authenticateUser, unAuthenticateUser, currentUser, signOutUser } = useAuth();

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.log(e);
    } finally {
      unAuthenticateUser();
    }
  }, [unAuthenticateUser]);

  const getCognitoUserSession = useCallback(async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await authenticateUser(cognitoUser);
    } catch (error) {
      unAuthenticateUser();
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [authenticateUser, unAuthenticateUser]);

  useEffect(() => {
    getCognitoUserSession();
  }, []);

  if (isLoading) {
    return <LandingPage />;
  }

  const loggedInViews = () => (
    <Views tabs className="safe-areas">
      <Toolbar tabbar labels bottom>
        <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
        <Link tabLink="#view-items" icon="las la-gift" text="쇼핑" />
        <Link tabLink="#view-search" icon="las la-search" text="검색" />

        <Link tabLink="#view-mypage" icon="las la-user" text="마이페이지" />
      </Toolbar>
      <View id="view-home" stackPages main tab tabActive url="/" iosDynamicNavbar={false} />
      <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" />
      <View id="view-search" stackPages name="search" tab url="/search?is_main=true/" />

      <View id="view-mypage" stackPages name="mypage" tab url="/mypage?is_main=true" />
    </Views>
  );

  const loggedOutViews = () => <View id="view-intro" main url="/users/sign_in" />;

  return (
    <>
      <CustomPanel handleLogout={logoutHandler} isLoggedIn={currentUser.isAuthenticated} currentUser={currentUser} />
      {currentUser.isAuthenticated ? loggedInViews() : loggedOutViews()}
    </>
  );
};

export default F7Views;
