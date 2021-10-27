import { atom } from 'recoil';
import { AuthState, Price } from '@constants';
import { CurrentUser } from '@interfaces';

const initialAuthState: AuthState = {
  token: null,
  csrf: null,
  currentUser: null,
};

const initialPriceState: Price = {
  total: 0,
  discount: 0,
  final: 0,
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

export const itemState = atom({
  key: 'itemAtom',
  default: null,
});

export const priceState = atom({
  key: 'priceAtom',
  default: initialPriceState,
});
