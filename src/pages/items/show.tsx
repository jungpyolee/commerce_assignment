import { PageRouteProps, Item } from '@constants';
import { addCart, API_URL, getCart, getItem } from '@api';
import {
  BlockTitle,
  Button,
  f7,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  Sheet,
  Stepper,
  Swiper,
  SwiperSlide,
  Tab,
  Tabs,
  Toolbar,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { currency } from '@js/utils';
import { useRecoilState } from 'recoil';
import { badgeState } from '@atoms';
import logo from '../../assets/images/logo.png';
import { toast } from '@aws-amplify/ui';
const ItemShowPage = ({ f7route, f7router }: PageRouteProps) => {
  const [badge, setBadge] = useRecoilState(badgeState);

  const [item, setItem] = useState<Item>();
  const [count, setCount] = useState(1);
  const [liked, setLiked] = useState(false);
  const [lookMore, setLookMore] = useState(false);
  const itemId = f7route.params.id;

  const hueDegree = [45, 135, 180];

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

  const lookMoreHandler = () => {
    setLookMore(!lookMore);
  };

  return (
    <Page
      noToolbar
      onPageBeforeOut={() => {
        getCart().then((res) => {
          if (res.data.line_items) setBadge(res.data.line_items.length);
        });
      }}
    >
      <Navbar title="상품상세" backLink />

      {item && (
        <Swiper className="" pagination>
          {/* 기본이미지 */}
          <SwiperSlide key="0">
            <img className="max-h-96 w-full" src={API_URL + item.image_path} alt="itemImage" />
          </SwiperSlide>
          {/* 서브이미지3개 */}
          {item?.images?.map((image) => (
            <SwiperSlide key={image.id + 1}>
              <img className="max-h-96 w-full" src={API_URL + image.image_path} alt="itemImage" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="">
        {item && (
          <div>
            {/* header */}
            <div className="p-4 pt-0">
              <div className="">
                {' '}
                <img src={logo} alt="logo" className="w-16 h-12" />
              </div>
              <div className="font-semibold text-lg">{item.name}</div>
              {saleRate > 0 && (
                <div className="flex">
                  <p className="text-red-500">{saleRate}%</p> &nbsp;
                  <p className="text-gray-400 line-through">{currency(item.list_price)}</p>
                </div>
              )}
              <p className="font-semibold text-xl">{currency(item.sale_price)} 원</p>
            </div>

            {/* detail */}
            <div>
              <Toolbar className=" text-sm" noHairline tabbar>
                <Link tabLink="#tab-description" tabLinkActive>
                  상품정보
                </Link>
                <Link tabLink="#tab-review">상품리뷰</Link>
                <Link tabLink="#tab-QnA">문의</Link>
              </Toolbar>
              <Tabs className="bg-gray-200 p-4">
                <Tab tabActive id="tab-description">
                  <Swiper effect={'fade'} autoplay={{ delay: 750 }}>
                    <SwiperSlide>
                      <img className="max-h-96 w-full rounded-xl pb-2 -hue-rotate-90" src={API_URL + item.image_path} />
                    </SwiperSlide>{' '}
                    <SwiperSlide>
                      <img
                        className="max-h-96 w-full rounded-xl pb-2 -hue-rotate-180"
                        src={API_URL + item.image_path}
                      />
                    </SwiperSlide>{' '}
                    <SwiperSlide>
                      <img
                        className="max-h-96 w-full rounded-xl pb-2 -hue-rotate-270"
                        src={API_URL + item.image_path}
                      />
                    </SwiperSlide>
                  </Swiper>
                  <div className={lookMore ? 'text-xs' : 'text-xs line-clamp-3'}>{item.description}</div>

                  <div
                    onClick={lookMoreHandler}
                    className="mx-auto flex justify-center items-center w-1/2 h-10 mt-2 bg-gray-100 rounded-xl"
                  >
                    <p>상세정보 {lookMore ? '접기' : '더보기'}</p>
                    <Icon className="pt-0.5 pl-1" size={20} f7={lookMore ? 'chevron_up' : 'chevron_down'} />
                  </div>
                </Tab>
                <Tab id="tab-review">아직 리뷰가 없습니다.</Tab>
                <Tab id="tab-QnA">아직 QnA가 없습니다.</Tab>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="fixed z-50 flex border items-center bg-white	bottom-0 h-14 w-full p-1">
        <div
          onClick={() => {
            setLiked(!liked);
          }}
          className="w-2/12  flex justify-center items-center"
        >
          <div className="w-9 h-9 border rounded-lg flex items-center justify-center">
            <Icon
              className={liked ? 'text-red-500' : 'text-gray-500'}
              f7={liked ? 'heart_filled' : 'heart'}
              size={24}
            />
          </div>
        </div>

        <Button className=" w-10/12 text-white font-semibold h-9" fill sheetOpen=".cartModal">
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
            f7.toast.show({ text: '장바구니에 담았습니다', position: 'center', closeTimeout: 1500 });
          }}
          className=" w-full font-semibold h-10"
          fill
        >
          장바구니에 담기
        </Button>
      </Sheet>
    </Page>
  );
};

export default React.memo(ItemShowPage);
