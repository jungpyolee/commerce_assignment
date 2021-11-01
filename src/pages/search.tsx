import { getItemsByName } from '@api';
import ItemsWithSalePrice from '@components/ItemsWithSalePrice';
import logo from '../assets/images/logo.png';

import {
  Link,
  List,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Searchbar,
  Subnavbar,
  Tab,
  Tabs,
  Toolbar,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';

const SearchPage = ({ f7route }) => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  let keywords = ['즐거운', '흥미로운', '기분 좋은', '새로운', '오래된'];
  useEffect(() => {
    if (value)
      getItemsByName(value).then((res) => {
        setItems(res.data.items);
      });
  }, [value]);

  return (
    <Page name="search">
      <Navbar>
        <NavTitle>상품 검색</NavTitle>
        <Subnavbar inner={false}>
          <Searchbar
            placeholder="상품명을 입력해주세요"
            onChange={(e) => setValue(e.target.value)}
            disableButton
            onClickClear={() => {
              setValue('');
            }}
            onClickDisable={() => {
              setValue('');
            }}
          ></Searchbar>
        </Subnavbar>
      </Navbar>

      <div className="p-3    ">
        <div className="text-lg font-semibold mb-2">추천 검색어</div>{' '}
        <div className="flex flex-wrap ">
          {keywords.map((keyword, i) => {
            return (
              <div
                key={i}
                className={
                  value === keyword
                    ? 'bg-blue-300 border text-white py-1 px-2 mr-1 mb-1 rounded-2xl border-gray-300'
                    : 'bg-blue-100 border text-gray-600 py-1 px-2 mr-1 mb-1 rounded-2xl '
                }
                onClick={() => setValue(keyword)}
              >
                {keyword}
              </div>
            );
          })}
        </div>
      </div>

      <List noHairlines className="mt-0 text-sm font-thin ">
        {items && value ? (
          <ItemsWithSalePrice items={items} />
        ) : (
          <div>
            {' '}
            <img src={logo} alt="insomenia-logo" className="w-full h-auto opacity-20" />
          </div>
        )}
      </List>
    </Page>
  );
};
export default React.memo(SearchPage);
