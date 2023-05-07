import { Link, useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { CategoryRouteParams } from '../category/category.component';
import { NewItemValues } from '../../components/add-firebase/add-item.component';
import { getItemFromRoute } from '../../utils/firebase/firebase.utils';

const ItemPreview = () => {
  const { itemPara, subCategoryPara, shopPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const location = useLocation();
  const [product, setProduct] = useState<NewItemValues | undefined>(location.state);

  const fetchItem = async () => {
    try {
      const res = await getItemFromRoute(shopPara, subCategoryPara, itemPara);
      if (res !== undefined) {
        setProduct(res);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  };
  
  useEffect(() => {
    if (location.state === null) {
      const res = fetchItem();
    }
  }, []);

  console.log('product:', product);
  return (
    <div>
      {
        product
        && (
        <div>
          <div className="text-3xl text-red-900">{product.productName}</div>
          <div className="flex flex-col">
            
          </div>
        </div>
        )
      }
    </div>
  );
};

export default ItemPreview;
