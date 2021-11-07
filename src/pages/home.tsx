import { f7, Link, Navbar, NavRight, NavTitle, Page, Tab, Tabs, Toolbar } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import HomeTab from '@components/tabs/HomeTab';
import { getCart, getItemsByPage } from '@api';
import { useRecoilState } from 'recoil';
import { badgeState } from '@atoms';
import BestTab from '@components/tabs/BestTab';
import HotDealTab from '@components/tabs/HotDealTab';
import EventTab from '@components/tabs/EventTab';

const HomePage = () => {
  const [badge, setBadge] = useRecoilState(badgeState);

  const [items, setItems] = useState([]);

  useEffect(() => {
    getCart().then((res) => {
      if (res.data.line_items) setBadge(res.data.line_items.length);
    });
    (async () => {
      const firstPage = await getItemsByPage(1);
      const secondPage = await getItemsByPage(2);
      setItems(firstPage.data.items.concat(secondPage.data.items));
    })();
  }, []);

  return (
    <Page name="home">
      <Navbar>
        <NavTitle style={{ fontSize: 20, fontWeight: 700, letterSpacing: '6px' }}>GUZEGUZE</NavTitle>
        <NavRight>
          <Link
            onClick={() => {
              if (badge === 0) f7.toast.show({ text: '담긴 상품이 없습니다', position: 'top', closeTimeout: 1500 });
            }}
            className="text-black"
            href="/line_items"
            iconF7="cart"
            iconBadge={badge ? badge : 0}
            badgeColor="red"
          />
        </NavRight>
      </Navbar>

      <Toolbar noBorder style={{ fontSize: 14, backgroundColor: 'white' }} tabbar position="top">
        <Link tabLink="#tab-home" tabLinkActive>
          홈
        </Link>
        <Link tabLink="#tab-event">이벤트</Link>
        <Link tabLink="#tab-best">베스트</Link>
        <Link tabLink="#tab-hotDeal">특가</Link>
      </Toolbar>

      <Tabs swipeable>
        <Tab className="overflow-auto" id="tab-home" tabActive>
          <HomeTab items={items} />
        </Tab>

        <Tab className="overflow-auto" id="tab-event">
          <EventTab />
        </Tab>
        <Tab className="overflow-auto" id="tab-best">
          <BestTab items={items} />
        </Tab>
        <Tab className="overflow-auto" id="tab-hotDeal">
          <HotDealTab items={items} />
        </Tab>
      </Tabs>
    </Page>
  );
};
export default React.memo(HomePage);
