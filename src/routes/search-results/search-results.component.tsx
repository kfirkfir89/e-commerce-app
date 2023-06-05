import { useLocation } from 'react-router-dom';
import { ItemPreview } from '../../components/add-firebase/add-item.component';

const SearchResults = () => {
  const location = useLocation();
  const propsFromSearch: ItemPreview[] = location.state;

  return (
    <div className="flex flex-col">
      {propsFromSearch &&
        propsFromSearch.map((item) => (
          <div key={item.id}>{item.productName}</div>
        ))}
      herllo
    </div>
  );
};

export default SearchResults;
