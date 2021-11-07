import { priceState } from '@atoms';
import { useRecoilState } from 'recoil';
import React from 'react';
import { currency } from '@js/utils';

export const OrderPrice = () => {
  const [price, setPrice] = useRecoilState(priceState);

  return (
    <div className="w-full h-44 bg-white mt-2 p-5">
      <div className="flex justify-between mt-2">
        <p>총 상품금액</p>
        <p>{currency(price.total)} 원</p>
      </div>
      <div className="flex justify-between mt-2">
        <p>배송비</p>
        <p>{price.total - price.discount >= 30000 ? '0 원' : `+ ${currency(3000)} 원`}</p>
      </div>
      <div className="flex justify-between mt-2">
        <p>총 할인금액</p>
        <p>{price.discount ? `-${currency(price.discount)} 원` : '-'} </p>
      </div>
      <div className="flex justify-between mt-4">
        <p className="text-lg font-bold">총 결제금액</p>
        <p className="text-xl font-bold text-red-500">{currency(price.final)} 원</p>
      </div>
    </div>
  );
};
