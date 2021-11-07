import React from 'react';
import ItemsWithSaleRate from '../ItemComponents/ItemsWithSaleRate';
export default function HotDealTab({ items }) {
  return <React.Fragment>{items && <ItemsWithSaleRate items={items} />}</React.Fragment>;
}
