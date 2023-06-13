import { useState, useEffect, FC, ChangeEvent, useRef } from 'react';

export type CarouselProps = {
  images: string[] | File[];
};

const Carousel: FC<CarouselProps> = (props) => {
  const { images } = props;
  const [currentImg, setCurrentImage] = useState(0);
  const [currentImg2, setCurrentImage2] = useState(1);
  const [prevCurrentImg, setPrevCurrentImage] = useState(0);
  const [prevCurrentImg2, setPrevCurrentImage2] = useState(1);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

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

  useEffect(() => {
    const resize = () => {
      if (imgRef.current) {
        setImageHeight(imgRef.current.offsetHeight);
        setImageWidth(imgRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', resize);
  }, []);
  return (
    <div className="flex w-full justify-center">
      <div
        className="container relative flex w-full  overflow-hidden"
        style={{
          backgroundImage: `url(${images[prevCurrentImg]})`,
          height: `${imageHeight}px`,
        }}
      >
        <div>
          {images.length > 0 &&
            images.map((img, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`Image${index}`}
                className={`absolute top-0 flex transform transition-all duration-1000 ease-out ${
                  index === currentImg && 'translate-y-full'
                } ${index < currentImg && 'z-10'}`}
              >
                {typeof img !== 'string' ? (
                  <img
                    ref={imgRef}
                    onLoad={imageSizeHandler}
                    alt={`${index}`}
                    src={URL.createObjectURL(img)}
                  />
                ) : (
                  <img
                    ref={imgRef}
                    alt={`${index}`}
                    src={img}
                    onLoad={imageSizeHandler}
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
