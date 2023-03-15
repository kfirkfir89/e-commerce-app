import {
  ChangeEvent, useEffect, useMemo, useReducer, useRef, useState, 
} from 'react';
import {
  ref, uploadBytes, listAll, getDownloadURL, StorageReference, 
} from 'firebase/storage';
import { v4 } from 'uuid';
import {
  all, call, takeLatest, put, select, 
} from 'typed-redux-saga';
import { Action, AnyAction } from 'redux';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { storageFB } from '../../utils/firebase/firebase.utils';
import { ActionWithPayload, createAction, withMatcher } from '../../utils/reducer/reducer.utils';
import { RootState } from '../../store/store';
  
// ACTION AND TYPES
export enum UPLOADIMG_ACTION_TYPES {
  FETCH_UPLOADING_START = 'uploadImage/FETCH_UPLOADING_START',
  FETCH_UPLOADING_SUCCESS = 'uploadImage/FETCH_UPLOADING_SUCCESS',
  FETCH_UPLOADING_FAILED = 'uploadImage/FETCH_UPLOADING_FAILED',
}

export type FeatchUploadImageStart = Action<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START>;

export type FeatchImageUrl = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START, string>;

export type FeatchUploadImageSuccess = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, string[]>;

export type FeatchUploadImageFailed = ActionWithPayload<UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, Error>;

export const featchUploadImageStart = withMatcher(
  (): FeatchUploadImageStart => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_START),
);

export const featchUploadImageSuccess = withMatcher(
  (imgUrlList: string[]): FeatchUploadImageSuccess => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_SUCCESS, imgUrlList),
);

export const featchUploadImageFailed = withMatcher(
  (error: Error): FeatchUploadImageFailed => createAction(UPLOADIMG_ACTION_TYPES.FETCH_UPLOADING_FAILED, error),
);

type ImageUploadState = {
  readonly imageUpload: File[];
  readonly imageUrlList: string[];
  readonly isLoading: boolean;
  readonly error: Error | null;

};

export const UPLOAD_INITIAL_STATE: ImageUploadState = {
  imageUpload: [],
  imageUrlList: [],
  isLoading: false,
  error: null,
};

export const uploadImgReducer = (
  state = UPLOAD_INITIAL_STATE,
  action: AnyAction,
): ImageUploadState => {
  if (featchUploadImageStart.match(action)) {
    return { ...state, isLoading: true };
  }

  if (featchUploadImageSuccess.match(action)) {
    return { ...state, imageUrlList: action.payload, isLoading: false };
  }

  if (featchUploadImageFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }

  return state;
};

// SELECTORS
const selectUploadImgReducer = (state: RootState): ImageUploadState => state.uploadImg;

export const selectUrlList = createSelector(
  [selectUploadImgReducer],
  (uploadUrlSlice) => uploadUrlSlice.imageUrlList,
);
export const selectImgList = createSelector(
  [selectUploadImgReducer],
  (uploadImgSlice) => uploadImgSlice.imageUpload,
);
export const selectIsLoading = createSelector(
  [selectUploadImgReducer],
  (uploadImgSlice) => uploadImgSlice.isLoading,
);


const UploadInput = () => {
  const [imgUpload, setImgUpload] = useState<FileList | null>(null);
  const [urlList, setUrlList] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const imagesListRef = ref(storageFB, 'images/');
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  // const [state, dispatch] = useReducer(uploadImgReducer, UPLOAD_INITIAL_STATE)

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setUrlList((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  
  async function UploadAsync(fileArray: File[]) {
    dispatch(featchUploadImageStart());
    const arr:string[] = [];
    try {
      const promises = fileArray.map(async (file) => {
        const imageRef = ref(storageFB, `images/${file.name + v4()}`);
        const snapshot = await uploadBytes(imageRef, file);
        return await getDownloadURL(snapshot.ref);
      });
  
      const urlArray = await Promise.all(promises);
  
      urlArray.forEach((url) => {
        arr.push(url);
      });
      
      // Update the state here after all uploads are complete
      setUrlList((prev) => [...prev, ...arr]);
      dispatch(featchUploadImageSuccess(arr));
    } catch (error) {
      console.log(error);
    }
  }
  
  const uploadImage = () => {
    if (imgUpload !== null) {
      const fileArray = Array.from(imgUpload);
      UploadAsync(fileArray);
      if (inputRef.current !== null) {
        inputRef.current.value = '';
      }
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    setImgUpload(e.target.files);
  };

  return (
    <div className="pt-40">
      <input multiple ref={inputRef} type="file" onChange={onChangeHandler} className="file-input file-input-bordered w-full max-w-xs" />
      <button type="button" onClick={uploadImage} className="btn">{isLoading ? 'Loading' : 'Upload Image'}</button>
      <div className="grid grid-cols-4">
        {urlList.map((url) => {
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          return <img className="h-20 w-20" key={`${v4()}`} src={url} alt="image" />; 
        })}
      </div>
    </div>
  );
};

export default UploadInput;
