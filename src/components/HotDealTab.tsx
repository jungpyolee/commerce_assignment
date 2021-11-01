import React from 'react';
import { List, ListItem } from 'framework7-react';

import { API_URL } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
import ItemsWithSalePrice from './ItemsWithSalePrice';
export default function HotDealTab(props) {
  const items = props.items;

  return (
    <div>
      <List noHairlines className="mt-0 text-sm font-thin ">
        <p className="font-black px-4 pt-4 text-lg">타임 세일 상품 </p>
        <p className="font-gray-400 px-4 ">최대 10% 할인 혜택!</p>
        {items && <ItemsWithSalePrice items={items} />}
      </List>
    </div>
  );
}
