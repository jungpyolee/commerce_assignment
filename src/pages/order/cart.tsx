import { Button, Icon, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { getCart, getItem } from '@api';
import React, { useEffect, useState } from 'react';
import { currency } from '@js/utils';
import { useRecoilState } from 'recoil';
import { badgeState, itemState, priceState } from '@atoms';
import { OrderPrice } from '../../components/OrderPrice';
import { ItemsWithOrderDetail } from '../../components/ItemComponents/ItemsWithOrderDetail';
import freeEvent from '../../assets/images/freeEvent.png';
const CartPage = ({ f7router }: PageRouteProps) => {
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useRecoilState(itemState);
  const [price, setPrice] = useRecoilState(priceState);
  const [badge, setBadge] = useRecoilState(badgeState);

  useEffect(() => {
    getCartListFn();
  }, []);

  const getCartListFn = async () => {
    const { data } = await getCart();

    setCartItems(data.line_items);

    let detailedItem = [];

    for (let i = 0; i < data.line_items.length; i++) {
      const result = await getItem(data.line_items[i].item_id);
      result.data.quantity = data.line_items[i].quantity;
      result.data.ITEMID = data.line_items[i].id;
      detailedItem.push(result.data);
    }
    setItems(detailedItem);
    let totalPrice = 0;
    let discountPrice = 0;
    let finalPrice = 0;
    let freeShipment = 30000;
    let shippingFee = 3000;

    for (let i = 0; i < detailedItem.length; i++) {
      totalPrice += detailedItem[i].list_price * detailedItem[i].quantity;
      discountPrice += (detailedItem[i].list_price - detailedItem[i].sale_price) * detailedItem[i].quantity;
    }

    finalPrice = totalPrice - discountPrice;
    if (finalPrice < freeShipment) finalPrice += shippingFee;
    setPrice({ total: totalPrice, discount: discountPrice, final: finalPrice });
  };

  const badgeRefresher = () => {
    getCart().then((res) => {
      if (res.data.line_items) setBadge(res.data.line_items.length);
    });
  };

  return (
    <Page onPageBeforeOut={badgeRefresher} className="bg-gray-200" noToolbar>
      <Navbar title="장바구니" backLink />

      {cartItems.length ? (
        <div>
          {/* item */}
          <ItemsWithOrderDetail f7router={f7router} isCart={true} />
          {/* price */}
          <img className="w-full mb-4" src={freeEvent} alt="freeEvent" />
          <OrderPrice />
          <div className="fixed flex bg-white  bg-opacity-90	bottom-0 h-12 w-full p-1">
            <Button
              onClick={() => {
                f7router.navigate('/order');
              }}
              className="bg-gray-800 w-full text-white font-semibold h-full"
              fill
            >
              총 {items?.length}개 &nbsp;&nbsp; {currency(price.final)}원 구매하기
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Icon className="mr-4" f7="cart" size="64" />

          <Button
            onClick={() => {
              f7router.back();
            }}
            className="w-60 h-14 mt-4 text-lg"
            text="상품 담으러 가기"
            fill
          />
        </div>
      )}
    </Page>
  );
};

export default React.memo(CartPage);
