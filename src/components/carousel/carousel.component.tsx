/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { ReactComponent as ArrowBack } from '../../assets/arrow_back.svg';
import { ReactComponent as ArrowForward } from '../../assets/arrow_forward.svg';

export const images = [
  {
    title: 'image-one',
    subtitle: 'This is a slider',
    img: 'https://i.ibb.co/R70vBrQ/men.png',
  },
  {
    title: 'image-Two',
    subtitle: 'This is a slider',
    img: 'https://i.ibb.co/GCCdy8t/womens.png',
  },
  {
    title: 'image-Three',
    subtitle: 'This is a slider',
    img: 'https://i.ibb.co/0jqHpnp/sneakers.png',
  },
];

const Carousel = () => {
  const [currentImg, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      currentImg < images.length - 1
        ? setCurrentImage(currentImg + 1)
        : setCurrentImage(0);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentImg]);

  return (
    <section className="container flex h-[350px] w-screen items-center justify-center ">
      <div className="h-full w-full">
        <div
          style={{ backgroundImage: `url(${images[currentImg].img})` }}
          className="relative h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        >
          {/* bg-gradient */}
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black/30"></div>

          {/* title-subtitle */}
          {/* <div className="text-white opacity-60 flex flex-col gap-3 mb-3 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <span className="">{images[currentImg].title}</span>
            <span className="">{images[currentImg].subtitle}</span>
          </div> */}

          {/* circles */}
          {/* <div className="flex absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <div
              onClick={() => setCurrentImage(0)}
              className={`w-3 h-3 rounded-full bg-white transition-all ease-in-out duration-1000 mr-3 cursor-pointer  ${
                currentImg === 0 ? 'opacity-80' : 'opacity-30'
              }`}
            >
            </div>

            <div
              onClick={() => setCurrentImage(1)}
              className={`w-3 h-3 rounded-full bg-white transition-all ease-in-out duration-1000 mr-3 cursor-pointer  ${
                currentImg === 1 ? 'opacity-80' : 'opacity-30'
              }`}
            >
            </div>

            <div
              onClick={() => setCurrentImage(2)}
              className={`w-3 h-3 rounded-full bg-white transition-all ease-in-out duration-1000 mr-3 cursor-pointer  ${
                currentImg === 2 ? 'opacity-80' : 'opacity-30'
              }`}
            >
            </div>
          </div> */}

          {/* button-group */}
          {/* <button
            onClick={() => (currentImg > 0
              ? setCurrentImage(currentImg - 1)
              : setCurrentImage(2))}
            className="absolute text-white left-7 top-1/2"
          >
            <span className="w-6 h-6 opacity-30 hover:opacity-80 transition-all ease-in-out duration-300">
              <ArrowBack />
            </span>
          </button>

          <button
            onClick={() => (currentImg < images.length - 1
              ? setCurrentImage(currentImg + 1)
              : setCurrentImage(0))}
            className="absolute text-white right-7  top-1/2"
          >
            <span className="w-6 h-6 opacity-30 hover:opacity-80 transition-all ease-in-out duration-300">
              <ArrowForward />
            </span>
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
