import React from 'react';
import ItemsWithSaleRate from './ItemsWithSaleRate';
export default function HotDealTab(props) {
  const items = props.items;

  return <React.Fragment>{items && <ItemsWithSaleRate items={items} />}</React.Fragment>;
}
