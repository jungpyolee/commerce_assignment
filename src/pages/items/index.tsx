import { API_URL, getCart, getCategory, getItems, getItemsByCategoryId, getItemsByPage } from '@api';
import { badgeState } from '@atoms';
import { Item } from '@constants';
import { currency } from '@js/utils';
import { useFormik } from 'formik';
import { f7, Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import i18n from '../../assets/lang/i18n';

interface ItemFilterProps {
  category_id_eq: string;
}

const ItemIndexPage = ({ f7route }) => {
  const { is_main, category_id } = f7route.query;
  const [category, setCategory] = useState(null);
  const [viewType, setViewType] = useState('grid');
  const [badge, setBadge] = useRecoilState(badgeState);

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);
  const [showPreloader, setShowPreloader] = useState(true);

  const allowInfinite = useRef(true);

  const loadMore = (currentPage) => {
    if (!allowInfinite.current) return;

    allowInfinite.current = false;

    setTimeout(async () => {
      if (currentPage >= 5) {
        setShowPreloader(false);
        f7.toast.show({ text: '마지막 상품입니다.', position: 'bottom', closeTimeout: 1500 });
        return;
      }

      const { data } = await getItemsByPage(currentPage);

      setItems(items.concat(data.items));

      console.log(items);
      setCurrentPage(currentPage + 1);

      allowInfinite.current = true;
    }, 500);
  };

  useEffect(() => {
    // then을 사용
    if (category_id) {
      getCategory(category_id).then((resp) => {
        setCategory(resp.data);
      });

      getItemsByCategoryId(category_id).then((resp) => {
        setItems(resp.data.items);
      });
    } else {
      (async () => {
        const { data } = await getItems();
        setItems(data.items);
      })();
    }
  }, []);

  const filterForm = useFormik<ItemFilterProps>({
    initialValues: {
      category_id_eq: category_id,
    },
    onSubmit: async () => {},
  });

  // const { data, refetch } = useQuery<Items, Error>(
  //   ITEM_KEY,
  //   getItems({
  //     q: filterForm.values,
  //   }),
  // );

  const onRefresh = async (done) => {
    // await queryClient.removeQueries(ITEM_KEY);
    // await refetch();
    done();
  };

  return (
    <Page
      infinite
      infiniteDistance={50}
      infinitePreloader={is_main ? showPreloader : false}
      onInfinite={() => loadMore(currentPage)}
      noToolbar={!is_main}
      onPtrRefresh={onRefresh}
      ptr
    >
      <Navbar backLink={!is_main}>
        <NavTitle>{(category && category.title) || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/line_items" iconF7="cart" iconBadge={badge} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form fixed bg-white z-50 p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency(items?.length)}</b>개 상품
        </div>

        <ListInput
          type="select"
          defaultValue="grid"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          onChange={(e) => setViewType(e.target.value)}
        >
          {map(i18n.t('ui'), (v, k) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </ListInput>
      </form>
      <List noHairlines className="mt-14 text-sm font-thin ">
        {items && (
          <ul>
            {viewType === 'list'
              ? items.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
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
              : items.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
                    <div className="w-1/2 inline-flex grid-list-item relative">
                      <ListItem
                        mediaItem
                        link={`/items/${item.id}`}
                        title={`${item.name}`}
                        subtitle={`${currency(item.sale_price)}원`}
                        header={category_id ? category?.title : ''}
                        className="w-full"
                      >
                        <img
                          slot="media"
                          alt=""
                          src={API_URL + item.image_path}
                          className="w-40 m-auto radius rounded shadow"
                        />
                      </ListItem>
                    </div>
                  </React.Fragment>
                ))}
          </ul>
        )}
      </List>
    </Page>
  );
};

export default React.memo(ItemIndexPage);
