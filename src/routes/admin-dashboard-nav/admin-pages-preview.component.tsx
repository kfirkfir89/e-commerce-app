import { ChangeEvent, useState } from 'react';
import Carousel from '../../components/carousel/carousel.component';
import Carousel2Img from '../../components/carousel/carousel-2-img.component';

const PagesPreview = () => {
  const [banerImages, setBanerImages] = useState<File[]>([]);
  const [error, setError] = useState('');

  const imageUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      if (e.target.files.length % 2 !== 0) {
        setError('upload even number of images');
      }
      const fileArray = Array.from(e.target.files);
      setBanerImages(fileArray);
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center gap-6 font-smoochSans text-base text-slate-700">
      <div>
        <div className="alert max-w-xs rounded-none p-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 flex-shrink-0 stroke-info"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-sm">
              Please upload an even number of images.
            </span>
          </div>
        </div>
        <input
          onChange={imageUploadHandler}
          type="file"
          className="file-input-bordered file-input w-full max-w-xs rounded-none shadow-lg"
          multiple
        />
      </div>

      <div className="max-full flex w-full flex-col sm:hidden">
        <Carousel images={banerImages} />
      </div>
      <div className="max-full hidden w-full flex-col sm:flex">
        <Carousel2Img images={banerImages} />
      </div>
    </div>
  );
};
export default PagesPreview;
