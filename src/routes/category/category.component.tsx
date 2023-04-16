import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { selectCategoriesMap, selectCategoriesIsLoading } from '../../store/categories/category.selector';

export type CategoryRouteParams = {
  category: string;
};

const Category = () => {
  const { category } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const [products, setProducts] = useState(categoriesMap[category]);
  useEffect(() => {
    setProducts(categoriesMap[category]);
    console.log('products:', products);
  }, [category, categoriesMap]);
  return (
    <>
      <h2 className="text-4xl mb-6 text-center">{category.toUpperCase()}</h2>
      
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-4 gap-x-5 gap-y-12">
          {products
            && products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}
    </>
  );
};


export default Category;
