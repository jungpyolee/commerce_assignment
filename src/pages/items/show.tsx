import { PageRouteProps, Item } from '@constants';
import { API_URL, getItem } from '@api';
import { BlockTitle, Button, Icon, List, ListItem, Navbar, Page, Sheet, Swiper, SwiperSlide } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { currency } from '@js/utils';
const ItemShowPage = ({ f7route, f7router }: PageRouteProps) => {
  const [item, setItem] = useState<Item>();
  const [bookmarked, setBookmarked] = useState(false);
  const [lookMore, setLookMore] = useState(false);
  const itemId = f7route.params.id;

  const saleRate = parseInt((((item?.list_price - item?.sale_price) / item?.list_price) * 100).toFixed(0));

  console.log(saleRate);
  useEffect(() => {
    (async () => {
      const { data } = await getItem(itemId);

      setItem(data);
    })();
  }, []);

  console.log(item);

  return (
    <Page noToolbar>
      <Navbar title="상품상세" backLink />
      <Swiper pagination scrollbar>
        {item &&
          item?.images?.map((image) => (
            <SwiperSlide key={image.id}>
              {' '}
              <img src={API_URL + image.image_path} alt="itemImage" />
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

        <Button
          className="bg-gray-400 w-10/12 text-white font-semibold h-full"
          fill
          sheetOpen=".demo-sheet-swipe-to-step"
        >
          구매하기
        </Button>
      </div>

      <Sheet className="demo-sheet-swipe-to-step" style={{ height: 'auto' }} swipeToClose swipeToStep backdrop>
        <div className="sheet-modal-swipe-step">
          <div className="display-flex padding justify-content-space-between align-items-center">
            <div style={{ fontSize: '18px' }}>
              <b>Total:</b>
            </div>
            <div style={{ fontSize: '22px' }}>
              <b>$500</b>
            </div>
          </div>
          <div className="padding-horizontal padding-bottom">
            <Button large fill>
              Make Payment
            </Button>
            <div className="margin-top text-align-center">Swipe up for more details</div>
          </div>
        </div>
        <BlockTitle medium className="margin-top">
          Your order:
        </BlockTitle>
        <List noHairlines>
          <ListItem title="Item 1">
            <b slot="after" className="text-color-black">
              $200
            </b>
          </ListItem>
          <ListItem title="Item 2">
            <b slot="after" className="text-color-black">
              $180
            </b>
          </ListItem>
          <ListItem title="Delivery">
            <b slot="after" className="text-color-black">
              $120
            </b>
          </ListItem>
        </List>
      </Sheet>
    </Page>
  );
};

export default React.memo(ItemShowPage);
