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
  const [prevCurrentImg, setPrevCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      currentImg < images.length - 1
        ? setCurrentImage(currentImg + 1)
        : setCurrentImage(0);
    }, 3000);

    setPrevCurrentImage(currentImg);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImg]);

  return (
    <div
      className="container relative flex h-[350px] w-full items-center justify-center  overflow-hidden"
      style={{ backgroundImage: `url(${images[prevCurrentImg].img})` }}
    >
      <div className="flex h-full w-full flex-col">
        {images.map((img, index) => (
          <div
            key={img.title}
            className={`absolute  bottom-0 h-full w-full transform transition-all duration-1000 ease-out ${
              index === currentImg && 'translate-y-full'
            } ${index < currentImg && 'z-10'}`}
          >
            <img
              alt={img.title}
              src={images[index].img}
              className="w-full"
              // style={{ backgroundImage: `url(${images[currentImg].img})` }}
            />
            {index}
          </div>
        ))}
        {/* bg-gradient */}
        <div className="absolute h-full w-full bg-black bg-gradient-to-r opacity-10"></div>
      </div>
    </div>
  );
};

export default Carousel;
