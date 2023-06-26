import { NavLink } from 'react-router-dom';

import { useEffect, useState } from 'react';
import {
  HomePagePreview,
  getHomePagePreviewData,
} from '../../utils/firebase/firebase.utils';
import Carousel from '../../components/carousel/carousel.component';
import Spinner from '../../components/spinner/spinner.component';

const Home = () => {
  const [previewData, setPreviewData] = useState<HomePagePreview>();
  const [bigBannerArrays, setBigBannerArrays] = useState<{
    left: string[];
    rigth: string[];
  }>({ left: [], rigth: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPreview = async () => {
      try {
        const previewData = await getHomePagePreviewData();
        setPreviewData(previewData);
        setInterval(() => {
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.log('error:', error);
      }
    };

    const fetch = getPreview();
  }, []);

  useEffect(() => {
    if (previewData) {
      const left: string[] = [];
      const rigth: string[] = [];
      previewData.bigBaner.imageUrl.forEach((imgUrl, index) =>
        index % 2 === 0 ? rigth.push(imgUrl) : left.push(imgUrl)
      );
      setBigBannerArrays({ left, rigth });
    }
  }, [previewData]);

  return (
    <div className="flex w-full flex-col items-center">
      {!isLoading && previewData !== undefined ? (
        <>
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

          {/* banner */}
          <div className="gradient-home1 mb-4 flex w-[98vw] justify-center font-dosis tracking-wider text-slate-700">
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
          {/* big banner images */}
          <div className="flex h-full w-full flex-col items-center">
            <div className="container flex h-full w-full flex-col items-center sm:p-6">
              <div className="relative hidden w-full max-w-6xl items-center justify-center p-2 sm:flex">
                <div className="absolute  h-full w-full">
                  <div className="absolute h-full w-2 bg-emerald-300" />
                  <div className="absolute right-0 h-full w-2 bg-[#c39f76]" />
                  <div className="absolute bottom-0 h-2 w-full bg-sky-300 " />
                  <div className="absolute top-0 h-2 w-full bg-fuchsia-400" />
                </div>
                <div className="absolute z-50 h-full w-full">
                  <div className="relative flex h-full w-full justify-center">
                    <NavLink
                      to={
                        previewData.bigBaner.isProductList
                          ? `/product-list/${previewData.bigBaner.selectedOption.value}`
                          : previewData.bigBaner.selectedOption.value
                      }
                      className="btn absolute bottom-20  flex rounded-none border-none border-slate-700 bg-white px-24 py-6 text-slate-700 shadow-sm hover:border-dashed hover:bg-white"
                    >
                      <div className="flex h-full w-full items-center justify-center ">
                        <span className="leading-0 flex pt-1 font-smoochSans text-base font-semibold uppercase tracking-widest text-slate-700">
                          {previewData.bigBaner.selectedOption.value}
                        </span>
                      </div>
                    </NavLink>
                  </div>
                </div>
                {bigBannerArrays.left.length > 0 && (
                  <Carousel images={bigBannerArrays.left} />
                )}
                {bigBannerArrays.rigth.length > 0 && (
                  <Carousel images={bigBannerArrays.rigth} />
                )}
              </div>
              {/* bigbanner small screen */}
              <div className="relative flex w-full max-w-7xl items-center justify-center p-2 sm:hidden">
                <div className="absolute  h-full w-full">
                  <div className="absolute h-full w-2 bg-emerald-300" />
                  <div className="absolute right-0 h-full w-2 bg-[#c39f76]" />
                  <div className="absolute bottom-0 h-2 w-full bg-sky-300 " />
                  <div className="absolute top-0 h-2 w-full bg-fuchsia-400" />
                </div>
                <div className="absolute z-50 h-full w-full">
                  <div className="relative flex h-full w-full justify-center">
                    <NavLink
                      to={
                        previewData.bigBaner.isProductList
                          ? `/product-list/${previewData.bigBaner.selectedOption.value}`
                          : previewData.bigBaner.selectedOption.value
                      }
                      className="btn absolute bottom-20  flex rounded-none border-none border-slate-700 bg-white px-24 py-6 text-slate-700 shadow-sm hover:border-dashed hover:bg-white"
                    >
                      <div className="flex h-full w-full items-center justify-center ">
                        <span className="leading-0 flex pt-1 font-smoochSans text-base font-semibold uppercase tracking-widest text-slate-700">
                          {previewData.bigBaner.selectedOption.value}
                        </span>
                      </div>
                    </NavLink>
                  </div>
                </div>
                {bigBannerArrays.left.length > 0 && (
                  <Carousel images={previewData.bigBaner.imageUrl} />
                )}
              </div>
            </div>
          </div>
          {/* small banner images */}
          <div className=" container mb-6 grid h-full w-full max-w-7xl grid-cols-2  gap-8 p-2 px-4 pt-8 font-smoochSans text-xs font-semibold uppercase tracking-widest text-slate-700 sm:grid-cols-4 sm:p-6 sm:px-10">
            {previewData.smallBaner.map(
              (smallImage) =>
                smallImage.imageUrl && (
                  <NavLink
                    to={
                      smallImage.isProductList
                        ? `/product-list/${smallImage.selectedOption.value}`
                        : smallImage.selectedOption.value
                    }
                    className="flex h-full w-full flex-col gap-4"
                    key={smallImage.name}
                  >
                    <img
                      className="flex w-full justify-center shadow-md"
                      src={smallImage.imageUrl}
                      alt={smallImage.radioName}
                    />
                    <span className="px-4 text-center font-normal uppercase sm:text-base">
                      {smallImage.selectedOption.label}
                    </span>
                  </NavLink>
                )
            )}
          </div>
          {/* banner */}
          <div className="flex w-full justify-center bg-[#F4EDDD] font-dosis tracking-wider text-slate-700">
            <div className="flex w-full justify-center p-8">
              <div className="flex w-full flex-col items-center justify-between sm:gap-5">
                <h2 className="text-center font-smoochSans text-2xl font-semibold tracking-normal sm:text-5xl">
                  Up to 17% Off
                </h2>
                <div className="space-x-2 py-2 text-center lg:py-0">
                  <span className="text-sm">Plus free shipping! Use code:</span>
                  <span className="text-sm font-bold sm:text-base">NANA17</span>
                </div>
              </div>
            </div>
          </div>
          {/* medium banner images */}
          <div className=" container grid h-full w-full max-w-6xl grid-cols-1 gap-6 p-8 pt-8 sm:grid-cols-2 sm:gap-16 sm:p-20">
            {previewData.mediumBaner.map(
              (mediumImage) =>
                mediumImage.imageUrl && (
                  <div
                    key={mediumImage.name}
                    className="mb-8 flex flex-col gap-4 font-smoochSans  text-lg font-semibold  text-slate-700 sm:gap-6 "
                  >
                    <div className="relative flex w-full max-w-6xl items-center justify-center p-2 shadow-lg ">
                      <div className="absolute  h-full w-full">
                        <div className="absolute h-full w-2 bg-emerald-300" />
                        <div className="absolute right-0 h-full w-2 bg-[#c39f76]" />
                        <div className="absolute bottom-0 h-2 w-full bg-sky-300 " />
                        <div className="absolute top-0 h-2 w-full bg-fuchsia-400" />
                      </div>
                      <div className="relative h-[364px] w-full  lg:h-[634px]">
                        <img
                          className="absolute flex h-full w-full justify-center object-cover"
                          src={mediumImage.imageUrl}
                          alt={mediumImage.radioName}
                        />
                      </div>
                    </div>
                    <span className="px-4 text-center text-2xl  font-semibold uppercase">
                      {mediumImage.selectedOption.label}
                    </span>
                    <NavLink
                      to={
                        mediumImage.isProductList
                          ? `/product-list/${mediumImage.selectedOption.value}`
                          : mediumImage.selectedOption.value
                      }
                      className="btn flex self-center whitespace-nowrap rounded-none border-[1px] border-dashed border-slate-700 bg-white  p-2 px-12 font-smoochSans font-semibold text-slate-700 shadow-sm hover:text-white"
                    >
                      shop now
                    </NavLink>
                  </div>
                )
            )}
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
export default Home;
