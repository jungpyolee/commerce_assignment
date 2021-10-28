import { itemState, priceState } from '@atoms';
import { useRecoilState } from 'recoil';
import React from 'react';
import { currency } from '@js/utils';
import { AccordionContent, List, ListItem } from 'framework7-react';
import { API_URL } from '@api';

export const Items = () => {
  const [items, setItems] = useRecoilState(itemState);
  const [price, setPrice] = useRecoilState(priceState);
  return (
    <List className="mt-4" mediaList>
      <ListItem title="주문 상세 정보" after={items ? `${items[0]?.name} 외 ${items?.length - 1}건` : null}>
        {' '}
      </ListItem>
      {items &&
        items.map((item) => {
          return (
            <ListItem
              key={item.id}
              className=""
              title={item.name}
              subtitle={`수량: ${item.quantity}`}
              footer={price?.final > 30000 ? '무료 배송' : '배송비 부담'}
              after={`${currency(item.sale_price * item.quantity)} 원`}
            >
              <img className="rounded-xl" slot="media" src={API_URL + item.image_path} width="80" />
            </ListItem>
          );
        })}
    </List>
  );
};
