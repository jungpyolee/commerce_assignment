import React from 'react';
import { API_URL } from '@api';
import { Swiper, SwiperSlide } from 'framework7-react';
import event1 from '../assets/images/event1.png';
import event2 from '../assets/images/event2.png';
import event3 from '../assets/images/event3.png';
import event4 from '../assets/images/event4.png';
import event5 from '../assets/images/event5.png';
export const HomeTabSwiper = () => {
  let slide = [event1, event2, event3, event4, event5];
  return (
    <Swiper pagination autoplay={{ delay: 1500 }}>
      {slide.map((i) => {
        return (
          <SwiperSlide key={i}>
            <img src={i} className="max-w-full w-full h-40 " alt="itemImage" />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export const ItemShowPageMainSwiper = ({ item }) => {
  return (
    <Swiper className="" pagination>
      {/* 기본이미지 */}
      <SwiperSlide key="0">
        <img className="max-h-96 w-full" src={API_URL + item.image_path} alt="itemImage" />
      </SwiperSlide>
      {/* 서브이미지3개 */}
      {item?.images?.map((image) => (
        <SwiperSlide key={image.id + 1}>
          <img className="max-h-96 w-full" src={API_URL + image.image_path} alt="itemImage" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export const ItemShowPageDetailSwiper = ({ item }) => {
  return (
    <Swiper effect={'fade'} autoplay={{ delay: 750 }}>
      <SwiperSlide>
        <img className="max-h-96 w-full rounded-xl pb-2 -hue-rotate-90" src={API_URL + item.image_path} />
      </SwiperSlide>{' '}
      <SwiperSlide>
        <img className="max-h-96 w-full rounded-xl pb-2 -hue-rotate-180" src={API_URL + item.image_path} />
      </SwiperSlide>{' '}
      <SwiperSlide>
        <img className="max-h-96 w-full rounded-xl pb-2 -hue-rotate-270" src={API_URL + item.image_path} />
      </SwiperSlide>
    </Swiper>
  );
};
