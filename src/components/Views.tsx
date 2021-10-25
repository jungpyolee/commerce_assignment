import { logoutAPI } from '@api';
import CustomPanel from '@components/shared/CustomPanel';
import useAuth from '@hooks/useAuth';
import LandingPage from '@pages/landing';
import { destroyToken, getToken } from '@store';
import { sleep } from '@utils/index';
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
      setIsLoading(false);
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
        <Link tabLink="#view-users" icon="las la-address-book" text="사용자" />
        <Link tabLink="#view-contacts" icon="las la-edit" text="문의하기" />
        <Link tabLink="#view-mypage" icon="las la-user" text="마이페이지" />
      </Toolbar>
      <View id="view-home" stackPages main tab tabActive url="/" iosDynamicNavbar={false} />
      <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" />
      <View id="view-users" stackPages name="users" tab url="/users?is_main=true" />
      <View id="view-contacts" stackPages name="contacts" tab url="/contacts?is_main=true" />
      <View id="view-mypage" stackPages name="mypage" tab url="/mypage?is_main=true" />
    </Views>
  );

  const loggedOutViews = () => <View id="view-intro" main url="/intro" />;

  return (
    <>
      <CustomPanel handleLogout={logoutHandler} isLoggedIn={currentUser.isAuthenticated} currentUser={currentUser} />
      {currentUser.isAuthenticated ? loggedInViews() : loggedOutViews()}
    </>
  );
};

export default F7Views;
