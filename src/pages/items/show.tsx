import { PageRouteProps, Item } from '@constants';
import { addCart, getCart, getItem } from '@api';
import { Button, f7, Icon, Link, Navbar, Page, Sheet, Stepper, Tab, Tabs, Toolbar } from 'framework7-react';
import React, { useState } from 'react';
import { currency, saleRate } from '@js/utils';
import { useRecoilState } from 'recoil';
import { badgeState } from '@atoms';
import logo from '../../assets/images/logo.png';
import { ItemShowPageDetailSwiper, ItemShowPageMainSwiper } from '@components/Swipers';
import { useQuery } from 'react-query';

const ItemShowPage = ({ f7route, f7router }: PageRouteProps) => {
  const [badge, setBadge] = useRecoilState(badgeState);

  const [count, setCount] = useState(1);
  const [liked, setLiked] = useState(false);
  const [lookMore, setLookMore] = useState(false);
  const itemId = f7route.params.id;

  const { data: item } = useQuery(['getItem', { id: itemId }], () => getItem(itemId));

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

      {item?.data && <ItemShowPageMainSwiper item={item.data} />}

      {item?.data && (
        <div>
          {/* header */}
          <div className="p-4 pt-0">
            <div className="">
              {' '}
              <img src={logo} alt="logo" className="w-16 h-12" />
            </div>
            <div className="font-semibold text-lg">{item.data.name}</div>
            {saleRate(item.data) > 0 && (
              <div className="flex">
                <p className="text-red-500">{saleRate(item.data)}%</p> &nbsp;
                <p className="text-gray-400 line-through">{currency(item.data.list_price)}</p>
              </div>
            )}
            <p className="font-semibold text-xl">{currency(item.data.sale_price)} 원</p>
          </div>

          {/* detail */}

          <Toolbar className=" text-sm" noHairline tabbar>
            <Link tabLink="#tab-description" tabLinkActive>
              상품정보
            </Link>
            <Link tabLink="#tab-review">상품리뷰</Link>
            <Link tabLink="#tab-QnA">문의</Link>
          </Toolbar>
          <Tabs className="bg-gray-200 p-4">
            <Tab tabActive id="tab-description">
              <ItemShowPageDetailSwiper item={item.data} />
              <div className={lookMore ? 'text-xs' : 'text-xs line-clamp-3'}>{item.data.description}</div>

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
      )}

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
          <p>{currency(item?.data.sale_price * count)} 원</p>
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
