import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserFavorite } from '../../utils/firebase/firebase.user.utils';

import { selectCurrentUser } from '../../store/user/user.selector';

import ProductCard from '../../components/product-card/product-card.component';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import Spinner from '../../components/spinner/spinner.component';

const Favorites = () => {
  const currentUserSelector = useSelector(selectCurrentUser);
  const [userFavoriteItems, setUserFavoriteItems] = useState<ItemPreview[]>([]);

  useEffect(() => {
    const fetchUserFavortieItems = async () => {
      if (currentUserSelector) {
        try {
          const items = await getUserFavorite(
            currentUserSelector.favoriteProducts
          );
          setUserFavoriteItems(items);
        } catch (error) {
          console.log('error:', error);
        }
      }
    };

    const fetch = fetchUserFavortieItems();
  }, [currentUserSelector]);

  return (
    <div className="flex flex-col">
      {/* title */}
      <h2 className="mb-6 text-center text-2xl font-semibold  capitalize text-gray-600">
        my favorites
      </h2>
      <div className={`flex-col items-center justify-center `}>
        <div className="container">
          {/* products rendering */}
          <div className="mb-7 mt-4 flex flex-col">
            <div className="relative mx-2 grid grid-cols-2 gap-2 gap-y-4 sm:grid-cols-3 sm:gap-4 sm:gap-y-10 lg:grid-cols-4 2xl:grid-cols-5">
              {userFavoriteItems ? (
                userFavoriteItems.map((searchItem) => (
                  <div key={searchItem.id}>
                    <ProductCard product={searchItem} />
                  </div>
                ))
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
