import { API_URL, getItem, getOrder, getOrders } from '@api';
import { currency } from '@js/utils';
import { Icon, Link, Navbar, NavTitle, Page, Preloader } from 'framework7-react';
import React, { useEffect, useState } from 'react';

const HistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    getHistoryListFn();
  }, []);

  const getHistoryListFn = async () => {
    const { data } = await getOrders();

    const completeOrders = data.orders.filter((order) => {
      return order.status === 'complete';
    });
    let orderDetail = [];

    for (let i = 0; i < completeOrders.length; i++) {
      const result = await getOrder(completeOrders[i].id);

      orderDetail.push(result.data);
    }

    let moreDetail = [];

    for (let i = 0; i < orderDetail.length; i++) {
      let itemDetail = [];
      for (let j = 0; j < orderDetail[i].line_items.length; j++) {
        const { data } = await getItem(orderDetail[i].line_items[j].item_id);
        data.quantity = orderDetail[i].line_items[j].quantity;
        itemDetail.push(data);
      }

      orderDetail[i].itemDetail = itemDetail;

      moreDetail.push(orderDetail[i]);
    }

    setList(moreDetail);
    setIsLoading(false);
  };

  const totalPrice = (line_items) => {
    let price = 0;
    let freeShipment = 30000;
    let shippingFee = 3000;
    for (let i = 0; i < line_items.length; i++) {
      price = price + line_items[i].total;
    }

    if (price >= freeShipment) {
      return price;
    } else {
      price = price + shippingFee;
      return price;
    }
  };

  const orderList = list.map((order, i) => {
    return (
      <div key={i} className="bg-white  m-4 p-4 border rounded-xl">
        <div className="h-6 mb-2 text-lg text-blue-500 text-semibold">주문 완료</div>

        <div className="mb-2 flex justify-between">
          <div>
            <b>{order.receiver_name}</b>
            <p className="text-xs text-gray-600">
              ({order.zipcode}){order.address1}
              {order.address2}
            </p>
            <p className="text-xs text-gray-600">{order.receiver_phone}</p>
          </div>
          <div>
            <p className="whitespace-nowrap">
              총 <b>{currency(totalPrice(order.line_items))}</b>원
            </p>
          </div>
        </div>

        {order.itemDetail.map((item, i) => {
          return (
            <div key={i} className="h-16 flex mb-1">
              <img src={API_URL + item.image_path} className="w-16 h-16 mr-4 rounded-xl" />
              <div className="flex w-full justify-between items-center">
                <div>
                  <p>{item.name} </p>

                  <p>
                    {currency(item.sale_price)}원 {item.quantity}개
                  </p>
                </div>
                <Link href={`/items/${item.id}`} className="border text-sm p-2 h-6 rounded">
                  보러가기
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <Page className="bg-gray-100" name="history">
      <Navbar backLink>
        <NavTitle>주문 내역</NavTitle>
      </Navbar>

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Preloader />
          <p className="text-xl  mt-4 text-bold">주문 내역을 불러오는 중</p>
        </div>
      ) : list.length ? (
        orderList
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Icon f7="smiley" size="64" />

          <p className="text-xl  mt-4 text-bold">주문 내역이 없어요</p>
        </div>
      )}
    </Page>
  );
};
export default HistoryPage;
