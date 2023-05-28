import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';

import { ReactComponent as AddressIcon } from '../../assets/home_FILL0.svg';
import { ReactComponent as OrderIcon } from '../../assets/package_FILL0.svg';
import { ReactComponent as FavoritesIcon } from '../../assets/favorite_FILL0_w.svg';

const UserAccount = () => {
  const currentUserSelector = useSelector(selectCurrentUser);

  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-tl from-white via-gray-100 to-gray-300 text-slate-700">
      <div className="flex flex-col gap-2 p-10 text-3xl font-semibold text-white">
        <span className="w-fit bg-slate-700 p-1 px-4">Welcome To</span>
        <span className="w-fit bg-slate-700 p-1 px-4">Your Account</span>
      </div>
      <div className="flex justify-center">
        <div className="absolute  bottom-12 flex flex-col gap-4 px-4 lg:flex-row">
          <div className="flex w-full gap-x-6 bg-gray-100 p-2 px-6 shadow">
            <div className="rounded-md bg-white p-1">
              <FavoritesIcon className="w-11" />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <span className="font-semibold">Favorites</span>
              <span className="text-2xl font-extrabold">
                {currentUserSelector?.orders.length}
              </span>
            </div>
          </div>

          <div className="flex w-full gap-x-6 bg-gray-100 p-2 px-6 shadow">
            <div className="rounded-md bg-white p-1">
              <OrderIcon className="w-11" />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <span className="font-semibold">Orders</span>
              <span className="text-2xl font-extrabold">
                {currentUserSelector?.favoriteProducts.length}
              </span>
            </div>
          </div>

          <div className="flex w-full gap-x-6 bg-gray-100 p-2 px-6 shadow">
            <div className="rounded-md bg-white p-1">
              <AddressIcon className="w-11" />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <span className="font-semibold">Addresses</span>
              <span className="text-2xl font-extrabold">
                {currentUserSelector?.addresses.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
