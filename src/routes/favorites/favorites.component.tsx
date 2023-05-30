import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

const Favorites = () => {
  const currentUserSelector = useSelector(selectCurrentUser);

  return (
    <div>
      {currentUserSelector?.favoriteProducts.map((id) => (
        <p key={id}>{id}</p>
      ))}
    </div>
  );
};

export default Favorites;
