import { AccordionContent, Block, Button, f7, Icon, Link, List, ListItem, Navbar, Page } from 'framework7-react';
import { Order, PageRouteProps } from '@constants';
import { API_URL, getCart, getItem, getOrder } from '@api';
import React, { useEffect, useState } from 'react';
import OrderForm from './OrderForm';

const OrderPage = ({ f7route, f7router }: PageRouteProps) => {
  const [orderId, setOrderId] = useState<number>();

  useEffect(() => {
    getCart().then((res) => {
      setOrderId(res.data.id);
    });
  }, []);
  return (
    <Page className="bg-gray-200" noToolbar>
      <Navbar title="주문/결제" backLink />

      <OrderForm f7router={f7router} orderId={orderId} />
    </Page>
  );
};

export default React.memo(OrderPage);
