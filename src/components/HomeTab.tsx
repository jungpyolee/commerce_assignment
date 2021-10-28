import React, { useEffect, useState } from 'react';
import { List, ListItem, Swiper, SwiperSlide } from 'framework7-react';
import event1 from '../assets/images/event1.png';
import event2 from '../assets/images/event2.png';
import event3 from '../assets/images/event3.png';
import event4 from '../assets/images/event4.png';

import { API_URL, getItems } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
export default function HomeTab(props) {
  let slide = [event1, event2, event3, event4];
  const items = props.items;

  return (
    <div>
      <Swiper pagination autoplay={{ delay: 1500 }}>
        {slide.map((i) => {
          return (
            <SwiperSlide key={i}>
              <img src={i} className="max-w-full w-full h-40 " alt="itemImage" />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <List noHairlines className="mt-0 text-sm font-thin ">
        <p className="font-black px-4 pt-4 text-lg">주간 인기 상품</p>
        <p className="font-gray-400 px-4 ">주간 최고 판매량을 기록한 HOT 아이템!</p>
        {items && (
          <ul>
            {items.map((item: Item, i) => {
              let rate = saleRate(item);

              console.log(rate);
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

      <List noHairlines className="mt-0 text-sm font-thin ">
        <p className="font-black px-4 pt-4 text-lg">특별 할인 상품</p>
        <p className="font-gray-400 px-4 ">최대 10% 할인 혜택!</p>
        {items && (
          <ul>
            {items.map((item: Item, i) => {
              let rate = saleRate(item);

              console.log(rate);
              return (
                rate > 0 && (
                  <React.Fragment key={item.id}>
                    <div className="sm:w-1/4 md: w-1/2 inline-flex grid-list-item relative">
                      <ListItem
                        mediaItem
                        link={`/items/${item.id}`}
                        title={item.name}
                        subtitle={`${rate}% ${currency(item.sale_price)}원`}
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
                )
              );
            })}
          </ul>
        )}
      </List>
    </div>
  );
}
