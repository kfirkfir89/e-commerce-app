import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as MenuIcon } from '../../assets/menu_FILL0.svg';
import { ReactComponent as CloseIcon } from '../../assets/close_FILL0.svg';
import Search from '../../components/search/search.component';

type SideMenuProps = {
  categories: Map<string, string[]>;
  onChangeToggle: (isToggled: boolean) => void;
};

const SideMenu = ({ categories, onChangeToggle }: SideMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleIsMenuOpen = () => {
    onChangeToggle(isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="top-0 z-[100] w-full flex-none">
      <div className="flex bg-transparent">
        <div className="z-[100]">
          <label className="swap-rotate swap btn-circle border-none bg-transparent">
            <input
              type="checkbox"
              checked={isMenuOpen}
              className="outline-none"
              readOnly
            />
            <CloseIcon
              className="swap-on h-9 w-9 fill-current text-slate-600"
              onClick={toggleIsMenuOpen}
            />
            <MenuIcon
              className="swap-off h-9 w-9 fill-current text-slate-600"
              onClick={toggleIsMenuOpen}
            />
          </label>
        </div>
        <div className="bg-white">
          {isMenuOpen && (
            <div className="fixed top-[70px] left-0 z-50 flex h-screen w-full flex-col bg-white">
              <div className="flex w-full justify-center bg-gray-200 p-2">
                <Search />
              </div>

              <div className="flex overflow-x-auto border-b-[1px] border-dashed border-slate-400">
                {categories !== undefined &&
                  Array.from(categories.entries()).map(([key, value]) => {
                    return (
                      <div
                        className="flex-col border-r-[1px] border-dashed border-slate-400 p-6 pr-12 pb-10"
                        key={key}
                      >
                        <div key={key}>
                          <NavLink
                            to={`${key}`}
                            className={({ isActive }) =>
                              isActive
                                ? 'text leading-0 z-50 font-smoochSans font-semibold capitalize tracking-widest text-slate-900 underline underline-offset-4 hover:text-slate-900'
                                : 'text leading-0 z-50 font-smoochSans font-semibold tracking-widest text-slate-500 hover:text-slate-900'
                            }
                            onClick={toggleIsMenuOpen}
                          >
                            {key}
                          </NavLink>
                        </div>
                        {value.map((subTitle) => (
                          <div className="mx-2" key={subTitle}>
                            <NavLink
                              to={`${key}/${subTitle}`}
                              className={({ isActive }) =>
                                isActive
                                  ? 'leading-0 z-50 p-1 font-smoochSans text-sm capitalize tracking-widest text-slate-900 underline underline-offset-4 hover:text-slate-900'
                                  : 'leading-0 z-50 p-2 font-smoochSans text-sm tracking-widest text-slate-500 hover:text-slate-900'
                              }
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
              <div className="m-4 flex justify-center ">
                <div className="container">
                  <div className="mx-2 flex justify-center bg-emerald-200 p-6">
                    <div className="flex flex-col items-center justify-between sm:gap-5">
                      <h2 className="text-center text-2xl font-bold tracking-tighter sm:text-5xl">
                        Up to 25% Off
                      </h2>
                      <div className="space-x-2 py-2 text-center lg:py-0">
                        <span className="text-sm">
                          Plus free shipping! Use code:
                        </span>
                        <span className="text-sm font-bold sm:text-base">
                          NANA17
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-4 flex justify-center ">
                <div className="container">
                  <div className="mx-2 flex justify-center bg-emerald-200 p-6">
                    <div className="flex flex-col items-center justify-between sm:gap-5">
                      <h2 className="text-center text-2xl font-bold tracking-tighter sm:text-5xl">
                        Up to 25% Off
                      </h2>
                      <div className="space-x-2 py-2 text-center lg:py-0">
                        <span className="text-sm">
                          Plus free shipping! Use code:
                        </span>
                        <span className="text-sm font-bold sm:text-base">
                          NANA17
                        </span>
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

export default SideMenu;
