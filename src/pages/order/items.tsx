import { itemState, priceState } from '@atoms';
import { useRecoilState } from 'recoil';
import React from 'react';
import { currency } from '@js/utils';
import { f7, Icon, List, ListItem } from 'framework7-react';
import { API_URL, deleteCart } from '@api';

export const Items = ({ f7router, isCart }) => {
  const [items, setItems] = useRecoilState(itemState);
  const [price, setPrice] = useRecoilState(priceState);

  const priceHandler = (array) => {
    if (array.length) {
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
    } else {
      f7router.back('/', { force: true });
    }
  };

  const deleteCartItem = (id) => {
    deleteCart(id).then(() => {
      let array = items.filter((item) => {
        return item.ITEMID !== id;
      });

      priceHandler(array);
    });
  };
  return (
    <List noHairlines className="mt-4 mb-4" mediaList>
      <ListItem>
        <div className="w-full flex justify-between items-center">
          <b>주문 상세정보</b>{' '}
          {items && (
            <div className="text-sm flex">
              <b>{items[0]?.name}&nbsp; </b> <p> 외 {items?.length - 1}건</p>
            </div>
          )}
        </div>
      </ListItem>

      <ul>
        {items &&
          items.map((item) => {
            return (
              <li key={item.id} className="h-30 border-b p-6">
                <div className="flex justify-between">
                  <div className="flex">
                    <img
                      onClick={() => f7router.navigate(`/items/${item.id}`)}
                      className="w-20 h-20 rounded-xl "
                      slot="media"
                      src={API_URL + item.image_path}
                    />
                    <div className=" pt-1 pl-3 ">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs mb-1 ">{price?.final > 30000 ? '무료 배송' : '배송비 별도'}</p>
                      <div className="flex mt-3 items-center ">
                        <p className="text-sm">{`${item.quantity}개`}</p> &nbsp;{' '}
                        <b>{`${currency(item.sale_price * item.quantity)} 원`}</b>
                      </div>{' '}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      deleteCartItem(item.ITEMID);
                      f7.toast.show({ text: '상품을 제거했습니다.', position: 'center', closeTimeout: 1500 });
                    }}
                  >
                    {isCart && <Icon f7="multiply" size="20" />}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </List>
  );
};
