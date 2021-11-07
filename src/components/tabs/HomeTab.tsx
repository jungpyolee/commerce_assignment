import React from 'react';
import Categories from '../Categories';
import ItemsWithoutSaleRate from '../ItemComponents/ItemsWithoutSaleRate';
import ItemsWithSaleRate from '../ItemComponents/ItemsWithSaleRate';
import event5 from '../../assets/images/event5.png';
import { HomeTabSwiper } from '../Swipers';
export default function HomeTab({ items }) {
  return (
    <React.Fragment>
      <HomeTabSwiper />
      <Categories />
      <ItemsWithoutSaleRate items={items.slice(0, 8)} />
      <img src={event5} alt="homeBanner" className="w-full" />
      <ItemsWithSaleRate items={items} />
    </React.Fragment>
  );
}
