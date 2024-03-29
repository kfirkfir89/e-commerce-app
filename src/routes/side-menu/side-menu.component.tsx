import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as MenuIcon } from '../../assets/menu_FILL0.svg';
import { ReactComponent as CloseIcon } from '../../assets/close_FILL0.svg';
import Search from '../../components/search/search.component';

type SideMenuProps = {
  categories: Map<string, string[]>;
  onChangeToggle: (isToggled: boolean) => void;
};

const SideMenu = ({ categories, onChangeToggle }: SideMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleIsMenuOpen = () => {
    onChangeToggle(isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      toggleIsMenuOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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
        <div className=" bg-white">
          {isMenuOpen && (
            <div className="fixed left-0 top-[64px] z-50 flex h-screen w-full flex-col overflow-auto bg-white">
              <div className="flex w-full justify-center bg-gray-200 p-2">
                <Search onChangeToggle={() => toggleIsMenuOpen()} />
              </div>

              <div className="scrollbarStyle flex h-fit overflow-x-auto border-b-[1px] border-dashed border-slate-400">
                {categories !== undefined &&
                  Array.from(categories.entries()).map(([key, value]) => {
                    return (
                      <div
                        className="leading-0 flex h-full w-full min-w-[144px] flex-col border-r-[1px] border-dashed border-slate-400  font-smoochSans text-sm uppercase tracking-widest text-slate-700"
                        key={key}
                      >
                        <div
                          className="mb-2 flex justify-center border-b-[1px] border-dashed border-slate-700 p-3 font-semibold"
                          key={key}
                        >
                          <NavLink
                            to={`${key}`}
                            className={({ isActive }) =>
                              isActive
                                ? 'z-50 flex text-slate-900 underline underline-offset-4'
                                : 'z-50 flex  text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline'
                            }
                            onClick={toggleIsMenuOpen}
                          >
                            {key}
                          </NavLink>
                        </div>
                        <div className="mb-8 flex flex-col gap-3 p-2 px-6 capitalize ">
                          {value.map((subTitle) => (
                            <div key={subTitle}>
                              <NavLink
                                to={`${key}/${subTitle}`}
                                className={({ isActive }) =>
                                  isActive
                                    ? 'z-50 flex text-slate-900 underline underline-offset-4'
                                    : 'z-50 flex  text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline'
                                }
                                onClick={toggleIsMenuOpen}
                              >
                                {subTitle}
                              </NavLink>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* banner */}
              {/* <div className="flex w-full justify-center bg-[#F4EDDD] font-dosis tracking-wider text-slate-700">
                <div className="flex w-full justify-center p-8">
                  <div className="flex w-full flex-col items-center justify-between sm:gap-5">
                    <h2 className="text-center font-smoochSans text-2xl font-semibold tracking-normal sm:text-5xl">
                      Up to 17% Off
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
              </div> */}

              {/* banner */}
              <div className="relative flex w-full gap-4 overflow-x-hidden p-1 pb-2 text-yellow-800">
                <div className="flex animate-marquee gap-4 whitespace-nowrap ">
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                </div>

                <div className="absolute top-0 flex animate-marquee2 gap-4 whitespace-nowrap">
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                  <span>30% off $80 + free shipping</span>
                  <span>🌞🕶️🌞</span>
                </div>
              </div>

              <div className="gradient-home1 mb-4 flex w-full justify-center font-dosis tracking-wider text-slate-700">
                <div className="flex w-full justify-center  p-8 pt-14">
                  <div className="flex flex-col items-center justify-between sm:gap-3">
                    <div className="flex">
                      <h2 className="flex text-center font-smoochSans text-3xl font-semibold tracking-normal sm:text-5xl">
                        SUMMER TIME
                      </h2>
                      <div className=" rotate-12 px-1 pt-1 text-xl sm:text-3xl">
                        ⛱️
                      </div>
                    </div>
                    <div className="flex space-x-2 py-2 text-center lg:py-0">
                      <span className="text-sm leading-9">
                        30% off $80 + free shipping
                      </span>
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
