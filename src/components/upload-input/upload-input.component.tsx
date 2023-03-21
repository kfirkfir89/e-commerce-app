import {
  ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useReducer, useRef, useState, 
} from 'react';
import {
  ref, uploadBytes, getDownloadURL, 
} from 'firebase/storage';
import { Action, AnyAction } from 'redux';
import { v4 } from 'uuid';

import { storageFB } from '../../utils/firebase/firebase.utils';
import { ActionWithPayload, createAction, withMatcher } from '../../utils/reducer/reducer.utils';
import { ColorImages } from '../add-firebase/add-firebase.component';

  
// ACTION AND TYPES
export enum UPLOADIMG_ACTION_TYPES {
  FETCH_UPLOADING_START = 'uploadImage/FETCH_UPLOADING_START',
  FETCH_UPLOADING_IMGURL = 'uploadImage/FETCH_UPLOADING_IMGURL',
  FETCH_UPLOADING_SUCCESS = 'uploadImage/FETCH_UPLOADING_SUCCESS',
  FETCH_UPLOADING_FAILED = 'uploadImage/FETCH_UPLOADING_FAILED',
}

export type FeatchUploadImageStart = Action<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START>;

export type FeatchImageUrl = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_IMGURL, string>;

export type FeatchUploadImageSuccess = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, string[]>;

export type FeatchUploadImageFailed = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, Error>;

export const featchUploadImageStart = withMatcher(
  (): FeatchUploadImageStart => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START),
);

export const featchImageUrl = withMatcher(
  (url: string): FeatchImageUrl => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_IMGURL, url),
);

export const featchUploadImageSuccess = withMatcher(
  (imgUrlList: string[]): FeatchUploadImageSuccess => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, imgUrlList),
);

export const featchUploadImageFailed = withMatcher(
  (error: Error): FeatchUploadImageFailed => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, error),
);

type ImageUploadState = {
  readonly urlList: string[];
  readonly isLoading: boolean;
  readonly error: Error | null;
};


type ImageProps = {
  colorLabel: string
  onChange: (ColorImages: ColorImages) => void
  onChangeFiles: (imgColors:ImageColorsFiles) => void
};

export type ImageColorsFiles = {
  color: string
  files: File[]
};
// type ImageUploadProps = {
// } & InputHTMLAttributes<HTMLInputElement>;

export const UPLOAD_INITIAL_STATE: ImageUploadState = {
  urlList: [],
  isLoading: false,
  error: null,
};

// REDUCER
export const uploadImgReducer = (
  state = UPLOAD_INITIAL_STATE,
  action: AnyAction,
): ImageUploadState => {
  if (featchUploadImageStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (featchImageUrl.match(action)) {
    return { ...state, urlList: [...state.urlList, action.payload], isLoading: false };
  }

  if (featchUploadImageSuccess.match(action)) {
    return { ...state, urlList: [...state.urlList, ...action.payload], isLoading: false };
  }

  if (featchUploadImageFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

// COMPONENT
const UploadInput: FC<ImageProps> = ({
  onChangeFiles, onChange, colorLabel, 
}: ImageProps) => {
  const [imgUploadArr, setImgUploadArr] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(uploadImgReducer, UPLOAD_INITIAL_STATE);
  const {
    isLoading, urlList, error, 
  } = state;
  const memoizedimgUploadArr = useMemo(() => { 
    const imgUrlArr:string[] = [];
    imgUploadArr.map((img) => (imgUrlArr.push(URL.createObjectURL(img)))); 
    return imgUrlArr;
  }, [imgUploadArr]);
  // get all image from specific directory
  // const imagesListRef = ref(storageFB, 'images/');
  // useEffect(() => {
  //   listAll(imagesListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         dispatch(featchImageUrl(url));
  //       });
  //     });
  //   });
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // upload imges to firebase return a url array
  // const UploadAsync = useCallback(async (fileArray: File[]) => {
  //   dispatch(featchUploadImageStart());
  //   const urlList:string[] = [];
  //   try {
  //     const promises = fileArray.map(async (file) => {
  //       const imageRef = ref(storageFB, `images/${file.name + v4()}`);
  //       const snapshot = await uploadBytes(imageRef, file);
  //       return await getDownloadURL(snapshot.ref);
  //     });
  
  //     const urlArray = await Promise.all(promises);
  
  //     urlArray.forEach((url) => {
  //       urlList.push(url);
  //     });
  //     // Update the state here after all uploads are complete
  //     // create an obj type to pass
  //     const colorImages:ColorImages = {
  //       itemUrlList: urlList,
  //       color: colorLabel,
  //     }; 
  //     onChange(colorImages);
  //     dispatch(featchUploadImageSuccess(urlList));
  //   } catch (error: any) {
  //     dispatch(featchUploadImageFailed(error));
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  
  // upload inside component
  // const uploadImage = useCallback(() => {
  //   if (imgUpload !== null) {
  //     const fileArray = Array.from(imgUpload);
  //     setImgUploadArr(fileArray);
      
  //     UploadAsync(fileArray);

  //     if (inputRef.current !== null) {
  //       inputRef.current.value = '';
  //     }
  //   }
  // }, [imgUpload]);


  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const fileArray = Array.from(e.target.files);
      const imageColors: ImageColorsFiles = {
        color: colorLabel,
        files: fileArray,
      };
      onChangeFiles(imageColors);
      setImgUploadArr(fileArray);
    }
  };
  
  return (
    <div key={`${colorLabel}`} className="flex justify-center">
      <div className="flex flex-col justify-center gap-2 max-w-xs">
        <input multiple ref={inputRef} type="file" onChange={onChangeHandler} className="file-input file-input-bordered w-full max-w-xs" accept=".jpg, .jpeg, .jpe, .png, .gif, .bmp, .webp, .svg, .svgz" />
        {/* button when rendering indise the component */}
        {/* <button type="button" onClick={uploadImage} className={`btn max-w-xs ${isLoading && 'animate-pulse'}`}>{isLoading ? 'Loading' : 'Upload Images'}</button> */}
        {error && <span className="flex justify-center font-semibold text-red-600">somthing&apos;s goes wrong, try again</span>}
        <div className="flex">
          {memoizedimgUploadArr.map((img) => {
            // preview before upload
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
            return <img className="p-1" key={`${img}`} src={img} alt="img" />; 
          })}
        </div>
        {/* render from useMemo after uploaded */}
        {/* <div className="grid grid-cols-4">
          {memoizedUrlList.map((url) => {
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            return <img className="p-1" key={`${url}`} src={url} alt="image" />; 
          })}
        </div> */}
      </div>
    </div>
  );
};

export default memo(UploadInput);
