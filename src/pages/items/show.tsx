import { PageRouteProps, Item } from '@constants';
import { addCart, API_URL, getCart, getItem } from '@api';
import {
  BlockTitle,
  Button,
  f7,
  Icon,
  List,
  ListItem,
  Navbar,
  Page,
  Sheet,
  Stepper,
  Swiper,
  SwiperSlide,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { currency } from '@js/utils';
import { useRecoilState } from 'recoil';
import { badgeState } from '@atoms';
const ItemShowPage = ({ f7route, f7router }: PageRouteProps) => {
  const [badge, setBadge] = useRecoilState(badgeState);

  const [item, setItem] = useState<Item>();
  const [count, setCount] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [lookMore, setLookMore] = useState(false);
  const itemId = f7route.params.id;

  console.log(f7route.params);
  const saleRate = parseInt((((item?.list_price - item?.sale_price) / item?.list_price) * 100).toFixed(0));

  useEffect(() => {
    (async () => {
      const { data } = await getItem(itemId);

      setItem(data);
    })();
  }, []);

  const addCartHandler = (id, count) => {
    addCart(id, count).then((res) => {
      if (res.status === 200) {
        f7router.navigate('/line_items');
      } else {
        alert('장바구니 담기 실패');
      }
    });
  };

  return (
    <Page
      onPageBeforeOut={() => {
        getCart().then((res) => {
          if (res.data.line_items) setBadge(res.data.line_items.length);
        });
      }}
      noToolbar
    >
      <Navbar title="상품상세" backLink />
      <Swiper className="" pagination scrollbar>
        {item &&
          item?.images?.map((image) => (
            <SwiperSlide className="" key={image.id}>
              {' '}
              <img className="max-h-96 w-full" src={API_URL + image.image_path} alt="itemImage" />
            </SwiperSlide>
          ))}
      </Swiper>
      {/* middle */}
      <div className="p-2">
        {/* details */}

        {item && (
          <>
            <div className="">제조사</div>
            <div className="font-semibold text-xl">{item.name}</div>
            {saleRate > 0 && (
              <div className="flex">
                <p>{saleRate}%</p> &nbsp;
                <p className="text-gray-400 line-through">{currency(item.list_price)}</p>
              </div>
            )}
            <div className="font-semibold text-xl">{currency(item.sale_price)}원</div>
            {/* description */}
            <div className={lookMore ? '' : 'line-clamp-3'}>{item.description}</div>
            <div
              onClick={() => {
                setLookMore(!lookMore);
              }}
              className="mx-auto flex justify-center items-center w-1/2 h-10 mt-2 bg-gray-200 rounded-xl"
            >
              <p>상세정보 {lookMore ? '접기' : '더보기'}</p>
              <Icon className="pt-0.5" size={20} f7={lookMore ? 'chevron_up' : 'chevron_down'} />
            </div>
          </>
        )}
      </div>

      {/* footer */}
      <div className="fixed flex bg-gray-200  bg-opacity-90	bottom-0 h-12 w-full p-1">
        <div
          onClick={() => {
            setBookmarked(!bookmarked);
          }}
          className=" w-2/12 flex justify-center items-center"
        >
          <Icon className="text-gray-600" f7={bookmarked ? 'bookmark_filled' : 'bookmark'} />
        </div>

        <Button className=" w-10/12 text-white font-semibold h-full" fill sheetOpen=".cartModal">
          장바구니 담기
        </Button>
      </div>
      <Sheet className="w-full cartModal border rounded-t-xl p-4" style={{ height: 'auto' }} swipeToClose backdrop>
        <div className="flex justify-between">
          <div className="text-lg text-center">수량을 선택해주세요</div>
          <Stepper min={1} fill value={count} onStepperChange={setCount} />
        </div>
        <div className="text-xl flex justify-between my-2">
          <p>총액</p>
          <p>{currency(item?.sale_price * count)} 원</p>
        </div>

        <Button
          sheetClose
          onClick={() => {
            addCartHandler(itemId, count);
          }}
          className=" w-full font-semibold h-10"
          fill
        >
          장바구니에 추가
        </Button>
      </Sheet>
    </Page>
  );
};

export default React.memo(ItemShowPage);
