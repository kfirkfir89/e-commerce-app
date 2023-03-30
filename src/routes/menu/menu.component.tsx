
import { useState } from 'react';
import { ReactComponent as Menu } from '../../assets/menu_FILL0.svg';
import { ReactComponent as Close } from '../../assets/close_FILL0.svg';


const MenuIcon = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleIsMenuOpen = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex-none w-full sticky top-0 z-50">
      <div className="flex">
        <div className="z-40">
          <button onClick={toggleIsMenuOpen}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
        <div className="">
          {isMenuOpen 
          && (
          <div className="top-0 left-0 fixed flex flex-col w-full h-5/6 bg-red-500 z-50">
            <div className="bg-white h-20 w-full">
              <button className="text-2xl pt-6 pl-2" onClick={toggleIsMenuOpen}>
                <Close className="w-7 h-7" />
              </button>
            </div>
            <div>
              RENDERMENU HERE
            </div>
          </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MenuIcon;
