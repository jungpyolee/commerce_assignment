import React from 'react';
import { List, ListItem } from 'framework7-react';

import { API_URL } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
export default function HotDealTab(props) {
  const items = props.items;

  return (
    <div>
      <List noHairlines className="mt-0 text-sm font-thin ">
        <p className="font-black px-4 pt-4 text-lg">타임 세일 상품 </p>
        <p className="font-gray-400 px-4 ">최대 10% 할인 혜택!</p>
        {items && (
          <ul>
            {items.map((item: Item, i) => {
              let rate = saleRate(item);

              console.log(rate);
              return (
                rate > 0 && (
                  <React.Fragment key={item.id}>
                    <ListItem mediaItem link={`/items/${item.id}`} className="w-full pt-2">
                      <img
                        slot="media"
                        alt=""
                        src={API_URL + item.image_path}
                        className="w-40 m-auto radius rounded-xl "
                      />
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
        )}
      </List>
    </div>
  );
}
