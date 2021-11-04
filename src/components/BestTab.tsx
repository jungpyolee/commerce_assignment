import React from 'react';
import { List, ListItem } from 'framework7-react';

import { API_URL } from '@api';
import { Item } from '@constants';
import { currency } from '@js/utils';
import ItemsWithoutSaleRate from './ItemsWithoutSaleRate';
export default function BestTab(props) {
  const items = props.items;

  return (
    <div>
      <ItemsWithoutSaleRate items={items} />
    </div>
  );
}
