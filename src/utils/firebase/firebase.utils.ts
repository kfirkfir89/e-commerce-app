/* eslint-disable no-param-reassign */
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { v4 } from 'uuid';
import { AddFirebaseData } from '../../components/add-firebase/add-firebase.component';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import {
  ColorStock,
  SizeStock,
} from '../../components/add-firebase/add-item-stock.component';
import {
  BigBannerData,
  SmallImageBannerData,
  SmallImagesOptionsMapping,
} from '../../routes/admin-dashboard-nav/admin-pages-preview.component';
import { SelectOption } from '../../components/select/select.component';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDiAOKxGCILWOwHxN_mSRkvNQp4JBsCu2s',
  authDomain: 'nana-style-db.firebaseapp.com',
  projectId: 'nana-style-db',
  storageBucket: 'nana-style-db.appspot.com',
  messagingSenderId: '359320186468',
  appId: '1:359320186468:web:2b809dae472f358f31b971',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const functions = getFunctions();
export const storageFB = getStorage(firebaseApp);

export const db = getFirestore();

export type UserCollectionKeys = {
  keys: string[];
};

// set user custom collection-keys (categories) if not exsist
export async function setUserCollectionKeys(collectionKey: string) {
  const collectionRef = collection(db, 'system-data');
  const docRef = doc(collectionRef, 'user-collection-keys');
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const keysData = docSnapshot.data() as UserCollectionKeys;
    const isExsist = keysData.keys.some((key) => key === collectionKey);

    if (!isExsist) {
      const updatedKeys = {
        ...keysData,
        keys: [...keysData.keys, collectionKey],
      };
      await setDoc(docRef, updatedKeys);
    }
  } else {
    // If the document doesn't exist, create it with the specified data.
    await setDoc(docRef, { keys: [collectionKey] });
  }
}

export async function getUserCollectionKeys() {
  const userCollectionKeyDocRef = doc(db, 'system-data/user-collection-keys');
  const docSnapshot = await getDoc(userCollectionKeyDocRef);

  const res = docSnapshot.data() as UserCollectionKeys;
  return res.keys;
}

export type SubCollectionData = {
  created: Timestamp;
  collectionKey: string;
  docKey: string;
  sizeSortOption: SelectOption;
};
// add new data (products) to server
export async function addFirebaseData<T extends AddFirebaseData>(
  newData: T
): Promise<void> {
  const { collectionKey, docKey, items, sizeSortOption } = newData;
  const collectionRef = collection(db, 'system-data');
  const querySnapshot = await getDocs(collectionRef);

  if (querySnapshot.empty) {
    try {
      const res = await setUserCollectionKeys(collectionKey);
    } catch (error) {
      console.log('error:', error);
    }
  }

  const docRef = doc(db, collectionKey, docKey);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    try {
      const data: SubCollectionData = {
        created: Timestamp.fromDate(new Date()),
        collectionKey,
        docKey,
        sizeSortOption,
      };
      const docRef = await setDoc(doc(db, collectionKey, docKey), data);
    } catch (error) {
      console.log('error:', error);
    }
  }

  // create each item with full data
  items.forEach(async (item) => {
    try {
      const docRef = await setDoc(
        doc(db, collectionKey, docKey, 'items', item.id.toString()),
        item
      );
    } catch (error) {
      console.log('error:', error);
    }
  });

  // careate a preview for each item
  items.forEach(async (item) => {
    try {
      const totalStockInit = item.stock.reduce(
        (total: number, sizeStock: SizeStock) => {
          sizeStock.colors.forEach((colorStock: ColorStock) => {
            // eslint-disable-next-line no-param-reassign
            total += colorStock.count;
          });
          return total;
        },
        0
      );

      // const sortOptionsSizesAndColors = item.sizes.flatMap((size) =>
      //   item.colors.map((color) => `${size.value}-${color.label}`)
      // );

      const itemPreview: ItemPreview = {
        id: item.id,
        created: item.created,
        collectionKey,
        docKey,
        productName: item.productName,
        slug: item.slug,
        price: item.price,
        colors: item.colors,
        colorsSort: item.colors.map((color) => color.label),
        sizesSort: item.sizes.map((size) => size.value),
        stock: item.stock,
        initTotalStock: totalStockInit,
        totalStock: totalStockInit,
        discaount: item.discaount,
        imagesUrls: [
          item.colorImagesUrls[0].itemUrlList[0],
          item.colorImagesUrls[0].itemUrlList[1],
        ],
      };

      const docRef = await setDoc(
        doc(db, `${collectionKey}/${docKey}/items-preview`, itemPreview.id),
        itemPreview
      );
      const docRefAll = await setDoc(
        doc(db, 'all-items-preview', itemPreview.id.toString()),
        itemPreview
      );
    } catch (error) {
      console.log('error:', error);
    }
  });
}

// delete images in addFirebase component
export async function deleteImageUrls(urlList: string[]) {
  urlList.forEach((url) => {
    const imageRef = ref(storageFB, url);
    deleteObject(imageRef).catch((error) => {
      console.log('Failed to delete image: ', error);
    });
  });
}

export async function uploadImageUrls(
  imgFileList: File[] | File
): Promise<string[] | string> {
  let urlArray: string[] = [];
  let imgUrl = '';

  if ('name' in imgFileList) {
    const imageRef = ref(storageFB, `images/${imgFileList.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imgFileList);
    imgUrl = await getDownloadURL(snapshot.ref);
  }

  if (Array.isArray(imgFileList)) {
    const promises = imgFileList.map(async (file) => {
      const imageRef = ref(storageFB, `images/${file.name + v4()}`);
      const snapshot = await uploadBytes(imageRef, file);
      return await getDownloadURL(snapshot.ref);
    });

    urlArray = await Promise.all(promises);
  }

  return !imgUrl ? urlArray : imgUrl;
}

// image preview migrate no file types
type BigBannerDataWithoutImage = Omit<BigBannerData, 'image'>;
type SmallBannerDataWithoutImage = Omit<SmallImageBannerData, 'image'>;

export type HomePagePreview = {
  bigBaner: BigBannerDataWithoutImage;
  mediumBaner: SmallBannerDataWithoutImage[];
  smallBaner: SmallBannerDataWithoutImage[];
};

export async function setHomePagePreviewData(
  bigBanerData: BigBannerData,
  smallBanersImages: SmallImagesOptionsMapping
) {
  console.log('bigBanerData:', bigBanerData, smallBanersImages);
  const resUrl = await uploadImageUrls(bigBanerData.image);
  if (typeof resUrl !== 'string') {
    bigBanerData.imageUrl = resUrl;
    bigBanerData.image = [];
  }

  const operations = Object.values(smallBanersImages).map(
    async (imageBannerValue) => {
      const { image, ...otherProps } = imageBannerValue;
      const newDataNoFile: SmallBannerDataWithoutImage = {
        ...otherProps,
      };
      if (image) {
        const resUrl = await uploadImageUrls(image);
        if (typeof resUrl === 'string') {
          newDataNoFile.imageUrl = resUrl;
        }
      }
      return newDataNoFile;
    }
  );
  const smallBanersWithoutImage: SmallBannerDataWithoutImage[] =
    await Promise.all(operations);

  smallBanersWithoutImage.sort((a, b) => {
    const a2 = parseInt(a.name.slice(-1), 10);
    const b2 = parseInt(b.name.slice(-1), 10);
    return a2 - b2;
  });

  const mediumBanerSlice = smallBanersWithoutImage.slice(-2);
  const smallBanersSlice = smallBanersWithoutImage.slice(0, -2);

  const finalDataWithUrls: HomePagePreview = {
    bigBaner: {
      isProductList: bigBanerData.isProductList,
      selectedOption: bigBanerData.selectedOption,
      imageUrl: bigBanerData.imageUrl,
    },
    mediumBaner: mediumBanerSlice,
    smallBaner: smallBanersSlice,
  };
  console.log('finalDataWithUrls:', finalDataWithUrls);
  const homePagePreviewDocRef = doc(db, 'system-data/home-page-preview');
  const docSnapshot = await getDoc(homePagePreviewDocRef);
  if (docSnapshot.exists()) {
    const oldPreview = docSnapshot.data() as HomePagePreview;
    const imgUrlToDelete = [
      ...oldPreview.bigBaner.imageUrl,
      ...oldPreview.mediumBaner.map((img) => img.imageUrl),
      ...oldPreview.smallBaner.map((img) => img.imageUrl),
    ];
    const deleteOldImages = await deleteImageUrls(imgUrlToDelete);
  }

  await setDoc(homePagePreviewDocRef, finalDataWithUrls);
}

export async function getHomePagePreviewData() {
  const homePagePreviewDocRef = doc(db, 'system-data/home-page-preview');
  const docSnapshot = await getDoc(homePagePreviewDocRef);
  const res = docSnapshot.data() as HomePagePreview;
  return res;
}

export async function getSortOptionSizeType(
  collectionKey: string,
  docKey: string
) {
  const homePagePreviewDocRef = doc(db, collectionKey, docKey);
  const docSnapshot = await getDoc(homePagePreviewDocRef);
  const res = docSnapshot.data() as {
    collectionKey: string;
    docKey: string;
    sizeSortOption: { label: string; value: string };
  };
  const option: SelectOption = res.sizeSortOption;
  return option;
}
