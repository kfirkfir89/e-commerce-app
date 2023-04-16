import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Category from '../category/category.component';
import { featchCategoriesStart } from '../../store/categories/category.action';
import SubCategory from '../sub-category/sub-category.component';

const CategoryRoute = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(featchCategoriesStart());    
  }, [dispatch]);

  return (
    <Routes>
      <Route index element={<Category />} />
      <Route path=":category" element={<SubCategory />} />
    </Routes>
  );
};

export default CategoryRoute;
