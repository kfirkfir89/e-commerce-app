import { useState, useEffect, FC } from 'react';

export type CarouselProps = {
  images: string[] | File[];
};

const Carousel: FC<CarouselProps> = (props) => {
  const { images } = props;
  const [currentImg, setCurrentImage] = useState(0);
  const [currentImg2, setCurrentImage2] = useState(1);
  const [prevCurrentImg, setPrevCurrentImage] = useState(0);
  const [prevCurrentImg2, setPrevCurrentImage2] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentImg < images.length - 1) {
        setCurrentImage(currentImg + 1);
        setCurrentImage2(currentImg2 + 1);
      } else {
        setCurrentImage(0);
        setCurrentImage2(1);
      }
    }, 3000);

    setPrevCurrentImage(currentImg);
    setPrevCurrentImage2(currentImg2);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImg, images]);

  return (
    <div className="flex w-full max-w-lg items-center justify-center">
      <div
        className="container relative flex h-[350px] w-1/2 items-center justify-center  overflow-hidden"
        style={{ backgroundImage: `url(${images[prevCurrentImg]})` }}
      >
        <div className="flex h-full w-full flex-col">
          {images.length > 0 &&
            images.map(
              (img, index) =>
                index % 2 === 0 && (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`Image${index}`}
                    className={`absolute bottom-0 flex h-full w-full transform transition-all duration-1000 ease-out ${
                      index === currentImg && 'translate-y-full'
                    } ${index < currentImg && 'z-10'}`}
                  >
                    {typeof img !== 'string' ? (
                      <img
                        alt={`${index}`}
                        src={URL.createObjectURL(img)}
                        className="h-full w-full"
                      />
                    ) : (
                      <img
                        alt={`${index}`}
                        src={img}
                        className="h-full w-full"
                        // style={{ backgroundImage: `url(${img})` }}
                      />
                    )}
                  </div>
                )
            )}
          {/* bg-gradient */}
          <div className="absolute h-full w-full bg-black bg-gradient-to-r opacity-10"></div>
        </div>
      </div>

      <div
        className="container relative flex h-[350px] w-1/2 items-center justify-center  overflow-hidden"
        style={{ backgroundImage: `url(${images[prevCurrentImg2]})` }}
      >
        <div className="flex h-full w-full flex-col">
          {images.length > 0 &&
            images.map(
              (img, index) =>
                index % 2 === 1 && (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`Image${index}`}
                    className={`absolute bottom-0 flex h-full w-full transform transition-all duration-1000 ease-out ${
                      index === currentImg2 && 'translate-y-full'
                    } ${index < currentImg2 && 'z-10'}`}
                  >
                    {typeof img !== 'string' ? (
                      <img
                        alt={`${index}`}
                        src={URL.createObjectURL(img)}
                        className="h-full w-full"
                      />
                    ) : (
                      <img
                        alt={`${index}`}
                        src={img}
                        className="h-full w-full"
                        // style={{ backgroundImage: `url(${img})` }}
                      />
                    )}
                  </div>
                )
            )}
          {/* bg-gradient */}
          <div className="absolute h-full w-full bg-black bg-gradient-to-r opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
