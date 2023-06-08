import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { AddFirebaseData } from '../../components/add-firebase/add-firebase.component';
import { ItemPreview } from '../../components/add-firebase/add-item.component';
import {
  ColorStock,
  SizeStock,
} from '../../components/add-firebase/add-item-stock.component';

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
// get user custom collection-keys for main navbar
export async function getUserCollectionKeys() {
  const collectionRef = collection(db, 'system-data');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);

  const res = querySnapshot.docs.map((docSnapshot) => {
    return docSnapshot.data() as UserCollectionKeys;
  });
  return res;
}
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
      const docRef = await setDoc(doc(db, collectionKey, docKey), {
        collectionKey,
        docKey,
        sizeSortOption,
      });
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
