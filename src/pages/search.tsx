import { API_URL, getItemsByName } from '@api';
import logo from '../assets/images/logo.png';
import { debounce } from 'lodash';
import { List, ListItem, Navbar, NavTitle, Page, Searchbar, Subnavbar } from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';
import { currency } from '@js/utils';
import { Item } from '@constants';

const SearchPage = () => {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  let keywords = ['즐거운', '흥미로운', '기분 좋은', '새로운', '오래된'];
  useEffect(() => {
    if (value)
      getItemsByName(value).then((res) => {
        setItems(res.data.items);
      });
  }, [value]);

  const changeHandler = (e) => {
    setValue(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 500), []);

  const clearHandler = () => {
    setValue('');
  };
  return (
    <Page name="search">
      <Navbar>
        <NavTitle>상품 검색</NavTitle>
        <Subnavbar inner={false}>
          <Searchbar
            placeholder="상품명을 입력해주세요"
            onChange={debouncedChangeHandler}
            disableButton
            onClickClear={clearHandler}
            onClickDisable={clearHandler}
          ></Searchbar>
        </Subnavbar>
      </Navbar>

      <div className="p-3">
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
        <ul>
          {items && value ? (
            items.map((item: Item, i) => (
              <React.Fragment key={i}>
                <ListItem
                  key={item.id}
                  mediaItem
                  link={`/items/${item.id}`}
                  title={`${item.name}`}
                  subtitle={`${currency(item.sale_price)}원`}
                  className="w-full"
                >
                  <img slot="media" src={API_URL + item.image_path} className="w-20 rounded" alt="" />
                </ListItem>
              </React.Fragment>
            ))
          ) : (
            <div>
              <img src={logo} alt="logo" className="w-full h-auto opacity-20" />
            </div>
          )}
        </ul>
      </List>
    </Page>
  );
};
export default React.memo(SearchPage);
