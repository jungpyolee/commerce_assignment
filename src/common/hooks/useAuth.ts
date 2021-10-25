import Auth, { CognitoUser } from '@aws-amplify/auth';
import { CurrentUser } from '@interfaces';
import { useCallback } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { currentUserState } from '@atoms';
import { userMeApi } from '@api';

type AuthenticateUser = (user: any) => Promise<void>;
type UnAuthenticateUser = () => Promise<void>;
type SignOutUser = () => Promise<void>;

type UseAuthHooks = () => {
  authenticateUser: AuthenticateUser;
  unAuthenticateUser: UnAuthenticateUser;
  currentUser: CurrentUser;
  signOutUser: SignOutUser;
};

const useAuth: UseAuthHooks = () => {
  const [currentUser, setCurrentUser] = useRecoilState<CurrentUser>(currentUserState);
  const resetCurrentUser = useResetRecoilState(currentUserState);

  // todo attributes
  const authenticateUser = useCallback(
    async (cognitoUser: any) => {

      const { data: user } = await userMeApi();
      setCurrentUser({ ...user, ...cognitoUser.attributes, isAuthenticated: true });
    },
    [setCurrentUser],
  );

  const unAuthenticateUser = useCallback(async () => {
    resetCurrentUser();
  }, [resetCurrentUser]);

  const signOutUser = useCallback(async () => {
    try {
      await Auth.signOut();
    } finally {
      unAuthenticateUser();
    }
  }, [unAuthenticateUser]);

  return {
    currentUser,
    signOutUser,
    authenticateUser,
    unAuthenticateUser,
  };
};

export default useAuth;
