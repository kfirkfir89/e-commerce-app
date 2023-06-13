import { Outlet } from 'react-router-dom';

import { useEffect, useState } from 'react';
import Directory from '../../components/directory/directory.component';
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
        }, 100);
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
    <div className="mt-16 flex  w-full flex-col items-center">
      {/* banner */}
      <div className="m-4 flex w-screen justify-center ">
        <div className="flex w-full justify-center bg-emerald-200 p-6">
          <div className="flex flex-col items-center justify-between sm:gap-5">
            <h2 className="text-center text-2xl font-bold tracking-tighter sm:text-5xl">
              Up to 25% Off
            </h2>
            <div className="space-x-2 py-2 text-center lg:py-0">
              <span className="text-sm">Plus free shipping! Use code:</span>
              <span className="text-sm font-bold sm:text-base">NANA17</span>
            </div>
          </div>
        </div>
      </div>
      {!isLoading && previewData !== undefined ? (
        <>
          <div className="flex h-full w-full flex-col items-center">
            {/* big banner images */}
            <div className="container  flex h-full w-full flex-col items-center">
              <div className="relative hidden w-full max-w-7xl items-center justify-center p-2 sm:flex">
                <div className="absolute  h-full w-full">
                  <div className="absolute h-full w-2 bg-green-500" />
                  <div className="absolute right-0 h-full w-2 bg-purple-500" />
                  <div className="absolute bottom-0 h-2 w-full bg-red-500" />
                  <div className="absolute top-0 h-2 w-full bg-yellow-500" />
                </div>
                <div className="absolute z-50 h-full w-full">
                  <div className="relative flex h-full w-full justify-center">
                    <button className=" btn-outline btn absolute bottom-28 left-1/3 right-1/3 flex rounded-none border-dashed px-32 py-6 text-slate-700  opacity-70 shadow-sm hover:opacity-90">
                      <div className="flex h-full w-full items-center justify-center ">
                        <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                          {previewData.bigBaner.selectedOption.value}
                        </span>
                      </div>
                    </button>
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
                  <div className="absolute h-full w-2 bg-green-500" />
                  <div className="absolute right-0 h-full w-2 bg-purple-500" />
                  <div className="absolute bottom-0 h-2 w-full bg-red-500" />
                  <div className="absolute top-0 h-2 w-full bg-yellow-500" />
                </div>
                <div className="absolute z-50 h-full w-full">
                  <div className="relative flex h-full w-full justify-center">
                    <button className=" btn-outline btn absolute bottom-28 flex rounded-none border-dashed px-32 py-6 text-slate-700  opacity-70 shadow-sm hover:opacity-90">
                      <div className="flex h-full w-full items-center justify-center ">
                        <span className="leading-0 flex pt-1 font-smoochSans text-xs font-semibold uppercase tracking-widest">
                          {previewData.bigBaner.selectedOption.value}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                {bigBannerArrays.left.length > 0 && (
                  <Carousel images={previewData.bigBaner.imageUrl} />
                )}
              </div>
            </div>
          </div>
          {/* small banner images */}
          <div className=" container grid h-full w-full max-w-7xl grid-cols-2 gap-8 p-2 pt-8 sm:grid-cols-4">
            {previewData.smallBaner.map((smallImage) => (
              <div className="" key={smallImage.name}>
                <img src={smallImage.imageUrl} alt={smallImage.radioName} />
              </div>
            ))}
          </div>
          {/* banner */}
          <div className="m-4 flex h-96 w-screen justify-center ">
            <div className="flex w-full justify-center bg-purple-200 p-6">
              <div className="flex flex-col items-center justify-between sm:gap-5">
                <h2 className="text-center text-2xl font-bold tracking-tighter sm:text-5xl">
                  Up to 25% Off
                </h2>
                <div className="space-x-2 py-2 text-center lg:py-0">
                  <span className="text-sm">Plus free shipping! Use code:</span>
                  <span className="text-sm font-bold sm:text-base">NANA17</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
export default Home;
