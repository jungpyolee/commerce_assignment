import React from 'react';
import { List, ListItem } from 'framework7-react';

import { API_URL } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
import ItemsWithSaleRate from './ItemsWithSaleRate';
export default function HotDealTab(props) {
  const items = props.items;

  return <div>{items && <ItemsWithSaleRate items={items} />}</div>;
}
