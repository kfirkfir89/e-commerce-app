import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ItemPreview } from '../add-firebase/add-item.component';
import { ReactComponent as FavoriteIcon } from '../../assets/favorite_FILL0_w.svg';
import { ReactComponent as FavoriteIconFill } from '../../assets/favorite_FILL1.svg';
import { updateUserFavorite } from '../../utils/firebase/firebase.user.utils';
import { selectCurrentUser } from '../../store/user/user.selector';
import { updateUserFavoriteProducts } from '../../store/user/user.action';

const ProductCard = ({ product }: { product: ItemPreview }) => {
  const { productName, price, imagesUrls, colors } = product;

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isProductFavorite, setIsProductFavorite] = useState(false);
  const currentUserSelector = useSelector(selectCurrentUser);
  const favoriteInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  // check if the current product is favorite by the user
  useEffect(() => {
    if (currentUserSelector) {
      currentUserSelector.favoriteProducts.includes(product.id) &&
        setIsProductFavorite(true);
    }
  }, [currentUserSelector, product.id]);

  // check for the state of the favorite icon comparing with current state user favoriteProducts
  useEffect(() => {
    if (isProductFavorite) {
      favoriteInputRef.current!.checked = true;
    } else {
      favoriteInputRef.current!.checked = false;
    }
  }, [isProductFavorite]);

  const onLoad = () => {
    setTimeout(() => setIsImageLoaded(true), 100);
  };

  // update the FavoriteProducts direct to server and update the current state of it to be sync
  const userFavortieHandler = async () => {
    try {
      await updateUserFavorite(product.id).then(() => {
        dispatch(updateUserFavoriteProducts(product.id));
        setIsProductFavorite(!isProductFavorite);
      });
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <div className={`max-w-xs ${!isImageLoaded ? 'invisible' : 'visible'}`}>
      <div className="relative shadow-sm">
        <Link
          to={`/${product.collectionKey}/${product.docKey}/${product.slug}`}
        >
          <img
            onLoad={onLoad}
            key={imagesUrls[0]}
            src={imagesUrls[0]}
            alt={imagesUrls[0]}
            className="max-h-full w-full object-cover object-center transition-opacity duration-200 ease-in-out"
          />
          <img
            onLoad={onLoad}
            key={imagesUrls[1]}
            src={imagesUrls[1]}
            alt={imagesUrls[1]}
            className="absolute left-0 top-0 max-h-full w-full object-cover object-center opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-100"
          />
        </Link>
        <div className="absolute bottom-0 right-2 z-50">
          <label className="swap swap-flip text-2xl">
            <input
              ref={favoriteInputRef}
              type="checkbox"
              onChange={userFavortieHandler}
            />
            <div className="swap-on">
              <FavoriteIconFill className="h-9 w-9 text-slate-600" />
            </div>
            <div className="swap-off">
              <FavoriteIcon className="h-9 w-9 text-slate-600" />
            </div>
          </label>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="pl-1 font-dosis">
          <Link
            to={`/${product.collectionKey}/${product.docKey}/${product.slug}`}
          >
            <h2 className="mb-1 text-sm font-semibold tracking-widest">
              {productName}
            </h2>
          </Link>
          <p className="mb-1 text-sm font-semibold tracking-wide">$ {price}</p>
          <div className="flex gap-1">
            {colors.map((c) => (
              <div
                key={c.label}
                className={`${c.value} h-2 w-2 rounded-full border border-gray-700 border-opacity-30`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
