import _ from 'lodash';
import {
  personalTaxIdLabel, federalTaxIdLabel, stateLabel,
} from '@/utils/local';

import { asyncActionStatusGetter } from '@/utils/vuex-api-utils';

export const requestStatus = asyncActionStatusGetter;

export const userIsLoggedIn = (state) => !!state.authToken;
export const user = (state) => state.user;

export const authHeader = ({ account, signatures }) => {
  if (!account || !signatures || !signatures[account]) return null;
  return `Basic ${btoa(`${account}:${signatures[account]}`)}`;
};
