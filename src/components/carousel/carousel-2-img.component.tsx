import { useState, useEffect, FC, ChangeEvent } from 'react';

export type CarouselProps = {
  images: string[] | File[];
};

const Carousel2Img: FC<CarouselProps> = (props) => {
  const { images } = props;
  const [currentImg, setCurrentImage] = useState(0);
  const [currentImg2, setCurrentImage2] = useState(1);
  const [prevCurrentImg, setPrevCurrentImage] = useState(0);
  const [prevCurrentImg2, setPrevCurrentImage2] = useState(1);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  console.log('imageHeight:', imageHeight, imageWidth);
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

  const imageSizeHandler = (e: ChangeEvent<HTMLImageElement>) => {
    setImageHeight(e.target.offsetHeight);
    setImageWidth(e.target.offsetWidth);
  };

  return (
    <div className="flex w-full justify-center">
      <div
        className="container relative flex w-full justify-end  overflow-hidden"
        style={{
          backgroundImage: `url(${images[prevCurrentImg]})`,
          height: `${imageHeight}px`,
        }}
      >
        <div
          className="flex h-full  flex-col"
          style={{
            width: `${imageWidth}px`,
          }}
        >
          {images.length > 0 &&
            images.map(
              (img, index) =>
                index % 2 === 0 && (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`Image${index}`}
                    className={`absolute bottom-0 flex transform transition-all duration-1000 ease-out ${
                      index === currentImg && 'translate-y-full'
                    } ${index < currentImg && 'z-10'}`}
                  >
                    {typeof img !== 'string' ? (
                      <img
                        onLoad={imageSizeHandler}
                        alt={`${index}`}
                        src={URL.createObjectURL(img)}
                      />
                    ) : (
                      <img
                        alt={`${index}`}
                        src={img}
                        onLoad={imageSizeHandler}
                      />
                    )}
                  </div>
                )
            )}
        </div>
      </div>
      <div
        className="container relative flex w-full  overflow-hidden"
        style={{
          backgroundImage: `url(${images[prevCurrentImg2]})`,
          height: `${imageHeight}px`,
        }}
      >
        <div
          className="flex h-full  flex-col"
          style={{
            width: `${imageWidth}px`,
          }}
        >
          {images.length > 0 &&
            images.map(
              (img, index) =>
                index % 2 === 1 && (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`Image${index}`}
                    className={`absolute bottom-0 flex transform transition-all duration-1000 ease-out ${
                      index === currentImg2 && 'translate-y-full'
                    } ${index < currentImg2 && 'z-10'}`}
                  >
                    {typeof img !== 'string' ? (
                      <img
                        onLoad={imageSizeHandler}
                        alt={`${index}`}
                        src={URL.createObjectURL(img)}
                      />
                    ) : (
                      <img
                        alt={`${index}`}
                        src={img}
                        onLoad={imageSizeHandler}
                      />
                    )}
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Carousel2Img;
