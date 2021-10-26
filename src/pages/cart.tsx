import { Button, f7, Icon, Link, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { API_URL, getCart, getItem } from '@api';
import React, { useEffect, useState } from 'react';

const CartPage = ({ f7route, f7router }: PageRouteProps) => {
  const [cartItems, setCartItems] = useState('');
  const [cartItem, setCartItem] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getCart();
      setCartItems(data);
      console.log(data.line_items);
    })();
  }, []);

  return (
    <Page className="bg-gray-200" noToolbar>
      <Navbar title="장바구니" backLink />

      {cartItems ? (
        <div>
          {/* item */}
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>{' '}
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>{' '}
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>{' '}
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>{' '}
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>{' '}
          <div className="w-full h-26 bg-white mt-2 p-4">
            <div className=" bg-gray-200 flex">
              <img
                className="w-1/5 mr-4"
                src="https://assignment.barber.work/uploads/square_bfc3baa0-b817-45be-b58b-aa889abceca7watch-4.png.png"
                alt="itemImage"
              />
              <div className="flex flex-col justify-center">
                <p>예쁜 시계</p>
                <p>2개</p>
                <p>15000원</p>
              </div>
            </div>
          </div>
          {/* price */}
          <div className="w-full h-52 bg-white mt-2 p-5">
            <div className="flex justify-between mt-2">
              <p>총 상품금액</p>
              <p>57000원</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>총 배송비</p>
              <p>+ 12000원</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>총 할인금액</p>
              <p>- 7000원</p>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-lg">결제금액</p>
              <p className="text-xl font-bold">49,600원</p>
            </div>
          </div>
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
