import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';
import ItemIndexPage from '@pages/items';
import ItemShowPage from '@pages/items/show';
import MyPage from '@pages/mypage';
import SignUpPage from '@pages/users/registrations/new';
import LoginPage from '@pages/users/sessions/new';
import CartPage from '@pages/order/cart';
import OrderPage from '@pages/order/order';
import HistoryPage from '@pages/history';
import SearchPage from '@pages/search';
const routes = [
  { path: '/', component: HomePage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
  { path: '/intro', component: IntroPage },
  { path: '/mypage', component: MyPage },
  { path: '/items', component: ItemIndexPage },
  { path: '/items/:id', component: ItemShowPage },
  { path: '/line_items', component: CartPage },
  { path: '/order', component: OrderPage },
  { path: '/history', component: HistoryPage },
  { path: '/search', component: SearchPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
