import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CategoryRouteParams } from '../category/category.component';
import { NewItemValues } from '../../components/add-firebase/add-item.component';
import { getItemFromRoute } from '../../utils/firebase/firebase.utils';

const ItemPreview = () => {
  const { subCategoryPara, shopPara } = useParams<keyof CategoryRouteParams>() as CategoryRouteParams;
  const location = useLocation();
  const [product, setProduct] = useState<NewItemValues | undefined>();
  const productId = location.state as string;

  const fetchItem = async () => {
    try {
      const res = await getItemFromRoute(shopPara, subCategoryPara, productId);
      if (res !== undefined) {
        setProduct(res);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    }
  };
  
  useEffect(() => {
    if (productId) {
      const res = fetchItem();
    }
  }, []);

  return (
    <div className="flex justify-center">
      {
        product
        && (
          <div className="container">

            <div className="flex-col mx-2">
              <div className="flex justify-center">
                <div className="text-3xl font-thin tracking-wider hover:text-slate-600 ">{product.productName}</div>
              </div>
              <div className="flex flex-col">
                <section className="py-6">
                  <div className="grid sm:grid-cols-2 gap-4">

                    <div className="flex-col max-w-5xl">
                      <div className="flex mb-2">
                        <img src={product.colorImagesUrls[0].itemUrlList[0]} alt="" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <img src={product.colorImagesUrls[0].itemUrlList[1]} alt="" />
                        <img src={product.colorImagesUrls[0].itemUrlList[2]} alt="" />
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex-col">

                        info
                      </div>
                    </div>

                  </div>
                </section>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ItemPreview;
