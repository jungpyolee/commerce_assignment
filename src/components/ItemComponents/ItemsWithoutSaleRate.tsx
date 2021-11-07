import { API_URL } from '@api';
import { Item } from '@constants';
import { currency } from '@js/utils';
import { List, ListItem } from 'framework7-react';
import React from 'react';

export default function ItemsWithoutSaleRate({ items }) {
  return (
    <List noHairlines className="mt-0 text-sm  ">
      <p className="font-bold px-4 pt-4 text-lg">주간 인기 상품</p>
      <p className="font-thin px-4 ">
        주간 최고 판매량을 기록한 <span className="font-semibold text-red-500">HOT</span> 아이템!
      </p>
      {items && (
        <ul>
          {items.map((item: Item, i) => {
            return (
              <React.Fragment key={i}>
                <div className="sm:w-1/4 md: w-1/2 inline-flex grid-list-item relative">
                  <ListItem
                    mediaItem
                    link={`/items/${item.id}`}
                    title={item.name}
                    subtitle={`${currency(item.sale_price)}원`}
                    className="w-full"
                  >
                    <img
                      slot="media"
                      alt=""
                      src={API_URL + item.image_path}
                      className="w-40 m-auto radius rounded-xl "
                    />
                  </ListItem>
                </div>
              </React.Fragment>
            );
          })}
        </ul>
      )}
    </List>
  );
}
