import React, { useEffect, useState } from 'react';
import { List, ListItem, Swiper, SwiperSlide } from 'framework7-react';
import event1 from '../assets/images/event1.png';
import event2 from '../assets/images/event2.png';
import event3 from '../assets/images/event3.png';
import event4 from '../assets/images/event4.png';
import event5 from '../assets/images/event5.png';
import bag from '../assets/icons/bag.png';
import shirts from '../assets/icons/shirts.png';
import onepiece from '../assets/icons/onepiece.png';
import pants from '../assets/icons/pants.png';

import { API_URL, getItems } from '@api';
import { Item } from '@constants';
import { currency, saleRate } from '@js/utils';
import Categories from './Categories';
import ItemsWithoutSaleRate from './ItemsWithoutSaleRate';
import ItemsWithSaleRate from './ItemsWithSaleRate';
export default function HomeTab(props) {
  let slide = [event1, event2, event3, event4, event5];
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
      <Categories />
      <ItemsWithoutSaleRate items={items.slice(0, 8)} />
      <img src={event5} alt="homeBanner" className="w-full" />

      <ItemsWithSaleRate items={items} />
    </div>
  );
}
