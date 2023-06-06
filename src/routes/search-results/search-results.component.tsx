import { useLocation } from 'react-router-dom';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

const SearchResults = () => {
  const location = useLocation();
  const propsFromSearch: ItemPreview[] = location.state;

  return (
    <div className="flex flex-col">
      {/* title */}
      <h2 className="mb-6 text-center text-2xl font-semibold  capitalize text-gray-600">
        Search Results
      </h2>
      <div className={`flex-col items-center justify-center `}>
        <div className="container">
          {/* products rendering */}
          <div className="mb-7 mt-4 flex flex-col">
            <div className="relative mx-2 grid grid-cols-2 gap-2 gap-y-4 sm:grid-cols-3 sm:gap-4 sm:gap-y-10 lg:grid-cols-4 2xl:grid-cols-5">
              {propsFromSearch ? (
                propsFromSearch.map((searchItem) => (
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

export default SearchResults;
