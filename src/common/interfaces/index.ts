import { Router } from 'framework7/types';

export * from './NativeInterfaces';
export * from './Scheme';

export * as AppSyncTypes from '../../API';

export interface F7Route {
  f7route: Router.Route;
  f7router: Router.Router;
}
