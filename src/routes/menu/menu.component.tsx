
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as Menu } from '../../assets/menu_FILL0.svg';
import { ReactComponent as Close } from '../../assets/close_FILL0.svg';

type MenuIconProps = {
  categories: Map<string, string[]>,
  onChangeToggle: (isToggled: boolean) => void
};

const MenuIcon = ({ categories, onChangeToggle } : MenuIconProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleIsMenuOpen = () => {
    onChangeToggle(isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex-none w-full top-0 z-[100]">
      <div className="flex bg-transparent">
        <div className="z-[100]">
          <label className="bg-transparent btn-circle swap swap-rotate border-none">
            <input type="checkbox" checked={isMenuOpen} className="outline-none" readOnly />
            <Close className="swap-on fill-current w-9 h-9 text-slate-600" onClick={toggleIsMenuOpen} />
            <Menu className="swap-off fill-current w-9 h-9 text-slate-600" onClick={toggleIsMenuOpen} />
          </label>
        </div>
        <div>
          {isMenuOpen 
          && (
          <div className="top-[70px] left-0 fixed flex flex-col w-full bg-white z-50 h-screen">
            <div className="flex overflow-x-auto border-b-[1px] border-slate-400 border-dashed">
              {categories !== undefined
                && Array.from(categories.entries()).map(([key, value]) => {
                  return ( 
                    <div className="flex-col border-r-[1px] border-slate-400 border-dashed p-6 pr-12 pb-10" key={key}>
                      <div key={key}>
                        <NavLink
                          to={`${key}`}
                          className={({ isActive }) => (isActive ? 'capitalize text font-semibold z-50 tracking-widest text-slate-900 font-smoochSans leading-0 hover:text-slate-900 underline underline-offset-4' : 'text font-semibold z-50 tracking-widest text-slate-500 font-smoochSans leading-0 hover:text-slate-900')}
                          onClick={toggleIsMenuOpen}
                        >
                          {key}       
                        </NavLink>
                      </div>
                      {value.map((subTitle) => (
                        <div className="mx-2" key={subTitle}>
                          <NavLink
                            to={`${key}/${subTitle}`}
                            className={({ isActive }) => (isActive ? 'p-1 capitalize text-sm z-50 tracking-widest text-slate-900 font-smoochSans leading-0 hover:text-slate-900 underline underline-offset-4' : 'p-2 text-sm z-50 tracking-widest text-slate-500 font-smoochSans leading-0 hover:text-slate-900')}
                            onClick={toggleIsMenuOpen}
                          >
                            {subTitle}       
                          </NavLink>
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>

            {/* banner */}
            <div className="flex justify-center m-4 ">
              <div className="container">
                <div className="p-6 bg-emerald-200 flex justify-center mx-2">
                  <div className="flex flex-col sm:gap-5 items-center justify-between">
                    <h2 className="text-center text-2xl sm:text-5xl tracking-tighter font-bold">
                      Up to 25% Off
                    </h2>
                    <div className="space-x-2 text-center py-2 lg:py-0">
                      <span className="text-sm">Plus free shipping! Use code:</span>
                      <span className="font-bold text-sm sm:text-base">NANA17</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center m-4 ">
              <div className="container">
                <div className="p-6 bg-emerald-200 flex justify-center mx-2">
                  <div className="flex flex-col sm:gap-5 items-center justify-between">
                    <h2 className="text-center text-2xl sm:text-5xl tracking-tighter font-bold">
                      Up to 25% Off
                    </h2>
                    <div className="space-x-2 text-center py-2 lg:py-0">
                      <span className="text-sm">Plus free shipping! Use code:</span>
                      <span className="font-bold text-sm sm:text-base">NANA17</span>
                    </div>
                  </div>
                </div>
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
