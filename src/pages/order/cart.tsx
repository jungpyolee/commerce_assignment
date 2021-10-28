import { Button, f7, Icon, Link, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { API_URL, getCart, getItem } from '@api';
import React, { useEffect, useState } from 'react';
import { array } from 'prop-types';
import { currency } from '@js/utils';
import { useRecoilState } from 'recoil';
import { itemState, priceState } from '@atoms';
import { Price } from './price';
import { Items } from './items';

const CartPage = ({ f7route, f7router }: PageRouteProps) => {
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useRecoilState(itemState);
  const [price, setPrice] = useRecoilState(priceState);
  useEffect(() => {
    (async () => {
      const { data } = await getCart();
      console.log(data);
      setCartItems(data.line_items);

      let array = [];

      for (let i = 0; i < data.line_items.length; i++) {
        const result = await getItem(data.line_items[i].item_id);
        result.data.quantity = data.line_items[i].quantity;
        array.push(result.data);
      }
      setItems(array);
      let totalPrice = 0;
      let discountPrice = 0;
      let finalPrice = 0;
      let shippingFee = 3000;
      for (let i = 0; i < array.length; i++) {
        totalPrice += array[i].list_price * array[i].quantity;
        discountPrice += (array[i].list_price - array[i].sale_price) * array[i].quantity;
      }

      finalPrice = totalPrice - discountPrice;
      if (finalPrice < 30000) finalPrice += shippingFee;
      setPrice({ total: totalPrice, discount: discountPrice, final: finalPrice });
    })();
  }, []);

  console.log('cartItems', cartItems);
  return (
    <Page className="bg-gray-200" noToolbar>
      <Navbar title="장바구니" backLink />

      {cartItems.length ? (
        <div>
          {/* item */}
          <Items />
          {/* price */}
          <Price />
          {/* footer */}
          <div className="fixed flex bg-white  bg-opacity-90	bottom-0 h-12 w-full p-1">
            <div className="w-3/12 flex justify-center items-center">
              <p>
                2개 <b>49,600원</b>
              </p>
            </div>

            <Button
              onClick={() => {
                f7router.navigate('/order');
              }}
              className="bg-gray-400 w-9/12 text-white font-semibold h-full"
              fill
            >
              바로구매
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Icon className="mr-4" f7="cart" size="64" />

          <Button
            onClick={() => {
              f7router.navigate('/');
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
