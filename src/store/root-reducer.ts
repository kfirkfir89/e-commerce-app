import { combineReducers } from 'redux';

import { userReducer } from './user/user.reducer';
import { categoriesReducer } from './categories/category.reducer';
import { cartReducer } from './cart/cart.reducer';
import { orderReducer } from './orders/order.reducer';
import { addFirebaseReducer } from './add-firebase/add-firebase.reducer';
import { uploadImgReducer } from '../components/upload-input/upload-input.component';

export const rootReducer = combineReducers({
  user: userReducer,
  categories: categoriesReducer,
  cart: cartReducer,
  order: orderReducer,
  addFirebase: addFirebaseReducer,
  uploadImg: uploadImgReducer,
});
