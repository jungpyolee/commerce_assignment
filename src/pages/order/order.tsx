import { AccordionContent, Block, Button, f7, Icon, Link, List, ListItem, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { API_URL, getCart, getItem } from '@api';
import React, { useEffect, useState } from 'react';
import OrderForm from './OrderForm';

const OrderPage = ({ f7route, f7router }: PageRouteProps) => {
  const [order, setOrder] = useState({});

  return (
    <Page className="bg-gray-200" noToolbar>
      <Navbar title="주문/결제" backLink />

      <OrderForm f7router={f7router} setOrder={setOrder} />
    </Page>
  );
};

export default React.memo(OrderPage);
