import { PageRouteProps, Item } from '@constants';
import { API_URL, getItem } from '@api';
import { Navbar, Page, Swiper, SwiperSlide } from 'framework7-react';
import React, { useEffect, useState } from 'react';

const ItemShowPage = ({ f7route, f7router }: PageRouteProps) => {
  const [item, setItem] = useState<Item>();
  const itemId = f7route.params.id;

  useEffect(() => {
    (async () => {
      const { data } = await getItem(itemId);

      setItem(data);
    })();
  }, []);

  console.log(item);

  return (
    <Page noToolbar>
      <Navbar title="상품상세" backLink />
      <Swiper pagination scrollbar>
        {item &&
          item?.images?.map((image) => (
            <SwiperSlide key={image.id}>
              {' '}
              <img src={API_URL + image.image_path} alt="itemImage" />
            </SwiperSlide>
          ))}
      </Swiper>
    </Page>
  );
};

export default ItemShowPage;
