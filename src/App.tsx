import { useEffect, lazy, Suspense, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import Spinner from './components/spinner/spinner.component';
import { checkUserSession } from './store/user/user.action';
import { PaymentSucceeded } from './routes/payment-succeeded/payment-succeeded.component';
import CategoriesPreview from './routes/categories-preview/categories-preview.componenet';
import NotFound from './routes/not-found/not-found.component';
import ItemPreview from './routes/item-preview/item-preview.component';
import AdminDBNav from './routes/admin-dashboard-nav/admin-db-nav.component';
import AdminDashboard from './routes/admin-dashboard-nav/admin-dashboard.component';
import Navigation from './routes/navigation/navigation.component';
import Category from './routes/category/category.component';
import SearchResults from './routes/search-results/search-results.component';
import UserDetails from './routes/user-profile/user-details.component';
import UserAddressBook from './routes/user-profile/user-address-book.component';
import UserOrders from './routes/user-profile/user-orders.component';
import UserProfile from './routes/user-profile/user-profile.component';
import UserAccount from './routes/user-profile/user-account.component';
import Cart from './routes/cart/cart.component';
import Favorites from './routes/favorites/favorites.component';
import AdminAdd from './routes/admin-dashboard-nav/admin-add-products.component';
import PagesPreview from './routes/admin-dashboard-nav/admin-pages-preview.component';

const Home = lazy(() => import('./routes/home/home.component'));
const Authentication = lazy(
  () => import('./routes/authentication/authentication.component')
);
const CheckOut = lazy(() => import('./routes/checkout/checkout.component'));

const App = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsCheckingSession(true);
    dispatch(checkUserSession());
    setIsCheckingSession(false);
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/*" element={<Navigation />}>
        <Route index element={<Home />} />

        <Route path=":shopPara" element={<Category />} />
        <Route path=":shopPara/:subCategoryPara" element={<Category />} />
        <Route
          path=":shopPara/:subCategoryPara/:itemPara"
          element={<ItemPreview />}
        />

        <Route path="authentication" element={<Authentication />} />

        <Route path="my-account/*" element={<UserProfile />}>
          <Route index element={<UserAccount />} />
          <Route path="details" element={<UserDetails />} />
          <Route path="address-book" element={<UserAddressBook />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>

        <Route path="checkout" element={<CheckOut />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="payment-succeeded" element={<PaymentSucceeded />} />
        <Route path="search-results" element={<SearchResults />} />

        <Route path="admin-dashboard/*" element={<AdminDBNav />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pages-preview" element={<PagesPreview />} />
          <Route path="addfirebase" element={<AdminAdd />} />
        </Route>

        <Route path="error" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return (
    <Suspense fallback={<Spinner />}>
      {!isCheckingSession ? <RouterProvider router={router} /> : <Spinner />}
    </Suspense>
  );
};
export default App;
