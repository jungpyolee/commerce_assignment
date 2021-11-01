import { API_URL } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
import { ListItem } from 'framework7-react';
import React from 'react';

export default function ItemsWithSalePrice(props) {
  const items = props.items;
  return (
    <ul>
      {items.map((item: Item, i) => {
        let rate = saleRate(item);

        return (
          rate > 0 && (
            <React.Fragment key={item.id}>
              <ListItem mediaItem link={`/items/${item.id}`} className="w-full pt-2">
                <img slot="media" alt="" src={API_URL + item.image_path} className="w-40 m-auto radius rounded-xl " />
                <div className="font-black pt-2">{item.name}</div>
                <div className="flex pt-2">
                  <p className="text-red-500 font-bold">{rate}% &nbsp;</p>{' '}
                  <p className="font-black">{currency(item.sale_price)}원 &nbsp;</p>{' '}
                  <p className="text-xs text-gray-500 line-through">{currency(item.list_price)}</p>
                </div>
              </ListItem>
            </React.Fragment>
          )
        );
      })}
    </ul>
  );
}
