import { useDispatch, useSelector } from 'react-redux';

import { selectIsMenuOpen } from '../../store/menu/menu.selector';
import { setIsMenuOpen } from '../../store/menu/menu.action';
import { ReactComponent as Menu } from '../../assets/menu_FILL0.svg';
import { ReactComponent as Close } from '../../assets/close_FILL0.svg';


const MenuIcon = () => {
  const dispatch = useDispatch();

  const isMenuOpen = useSelector(selectIsMenuOpen);

  const toggleIsCartOpen = () => dispatch(setIsMenuOpen(!isMenuOpen));

  return (
    <div className="flex-none w-full sticky top-0 z-50">
      <div className="flex">
        <div className="z-40">
          <button onClick={toggleIsCartOpen}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
        <div className="">
          {isMenuOpen 
          && (
          <div className="top-0 left-0 fixed flex justify-center w-screen h-5/6 bg-red-500 z-50">
            <div className="container">
              <div className="bg-white">
                <button className="text-2xl pt-3 pl-3" onClick={toggleIsCartOpen}>
                  <Close className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MenuIcon;
