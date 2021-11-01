import React from 'react';
import { List, ListItem } from 'framework7-react';

import { API_URL } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
export default function BestTab(props) {
  const items = props.items;

  return (
    <div>
      <List noHairlines className="mt-0 text-sm font-thin ">
        <p className="font-black px-4 pt-4 text-lg">주간 인기 상품</p>
        <p className="font-gray-400 px-4 ">주간 최고 판매량을 기록한 HOT 아이템!</p>
        {items && (
          <ul>
            {items.map((item: Item, i) => {
              let rate = saleRate(item);

              return (
                <React.Fragment key={item.id}>
                  <div className="sm:w-1/4 md: w-1/2 inline-flex grid-list-item relative">
                    <ListItem
                      mediaItem
                      link={`/items/${item.id}`}
                      title={item.name}
                      subtitle={`${rate > 0 ? `${rate}%` : ''} ${currency(item.sale_price)}원`}
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
    </div>
  );
}
