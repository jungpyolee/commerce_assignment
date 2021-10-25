import { atom } from 'recoil';
import { AuthState } from '@constants';
import { CurrentUser } from '@interfaces';

const initialAuthState: AuthState = {
  token: null,
  csrf: null,
  currentUser: null,
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: initialAuthState,
});

const initialCurrentUser: CurrentUser = {
  email: '',
  isAuthenticated: false,
};

export const currentUserState = atom<CurrentUser>({
  key: 'currentUser',
  default: initialCurrentUser,
});
