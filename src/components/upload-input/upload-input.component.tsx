import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import {
  ref, uploadBytes, listAll, getDownloadURL, 
} from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from '../../utils/firebase/firebase.utils';

const UploadInput = () => {
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const imagesListRef = ref(storage, 'images/');
  const inputRef = useRef<InputHTMLAttributes<HTMLInputElement>>('');

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrlList((prev: any) => [...prev, url]);
        });
      });
    });
  }, []);
  console.log('1', isLoading);

  const uploadImage = () => {
    if (imageUpload === null) {
      alert('no image imported');
    }
    const UploadAsync = async () => {
      try {
        setIsLoading(true);
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        const res = await uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setImageUrlList((prev) => [...prev, url]);
          });
        });
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    inputRef.current.value = '';
    UploadAsync();
    
    // const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    
    // uploadBytes(imageRef, imageUpload).then((snapshot) => {
    //   getDownloadURL(snapshot.ref).then((url) => {
    //     setImageUrlList((prev) => [...prev, url]);
    //   });
    // });
    // console.log(isLoading);
    // setIsLoading(false);
  };

  return (
    <div className="pt-40">
      <input ref={inputRef} type="file" onChange={(e: any) => { setImageUpload(e.target.files[0]); }} className="file-input file-input-bordered w-full max-w-xs" />
      <button type="button" onClick={uploadImage} className="btn">{isLoading ? 'Loading' : 'Upload Image'}</button>
      <div className="grid grid-cols-4">
        {imageUrlList.map((url:any) => {
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          return <img className="h-20 w-20" key={`${v4()}`} src={url} alt="image" />; 
        })}
      </div>
    </div>
  );
};

export default UploadInput;
