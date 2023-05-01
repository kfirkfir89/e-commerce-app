import { initializeApp } from 'firebase/app';
import {
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver,
} from 'firebase/auth';
import {
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  writeBatch,
  query,
  getDocs,
  QueryDocumentSnapshot,
  orderBy,
  limit,
  where,
  addDoc,
  startAfter,
  startAt,
  getCountFromServer,
  OrderByDirection,
  Query,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { Category, PreviewCategory } from '../../store/categories/category.types';    
import { NewOrderDetails } from '../../store/orders/order.types';
import { AddFirebaseData } from '../../components/add-firebase/add-firebase.component';
import {
  AllItemsPreview, ItemPreview, ItemsSizePreview, NewItemValues, 
} from '../../components/add-firebase/add-item.component';
import { SizeStock } from '../../components/add-firebase/add-item-stock.component';
import { SelectOption } from '../../components/select/select.component';
import { SortOption } from '../../routes/category/category.component';



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

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();


export type UserCollectionKeys = {
  keys: string[]
};

// get the user custom subcategories (doc title) by using user custom collectionKeys
export async function getUserKeysDocs(collectionKey: string) {
  const collectionRef = collection(db, collectionKey);
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  const categoryTitles: string[] = [];

  querySnapshot.forEach((doc) => {
    categoryTitles.push(doc.id);
  });

  return categoryTitles;
}
// get the user custom categories (collections keys) and call getUserKeysDocs to get all subCategories
export async function getUserCategories() {
  const collectionRef = collection(db, 'system-data');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  const data = new Map<string, string[]>();

  const res = querySnapshot.docs.map((docSnapshot) => {
    return docSnapshot.data() as UserCollectionKeys;
  });  

  res[0].keys.map(async (k) => {
    const res2 = await getUserKeysDocs(k);
    data.set(k, res2);
  });  
  return data;
}  

// set user custom collection-keys (categories) if not exsist
export async function setUserCollectionKeys(collectionKey: string) {
  const collectionRef = collection(db, 'system-data');
  const docRef = doc(collectionRef, 'user-collection-keys');
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const keysData = docSnapshot.data() as UserCollectionKeys;
    const isExsist = keysData.keys.some((key) => key === collectionKey);

    if (!isExsist) {
      const updatedKeys = { ...keysData, keys: [...keysData.keys, collectionKey] };
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
export async function addFirebaseData<T extends AddFirebaseData>(newData: T): Promise<void> {
  const { collectionKey, docKey, items } = newData;

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
      const docRef = await setDoc(doc(db, collectionKey, docKey), { collectionKey, docKey });
    } catch (error) {
      console.log('error:', error);
    }
  }

  // create each item with full data
  items.forEach(async (item) => {
    try {
      const docRef = await setDoc(doc(db, collectionKey, docKey, 'items', item.id.toString()), item);
    } catch (error) {
      console.log('error:', error);
    }
  });
  
  // careate a preview for each item 
  items.forEach(async (item) => {
    try {
      const itemPreview: ItemPreview = {
        id: item.id,
        created: item.created,
        collectionKey,
        docKey,
        productName: item.productName,
        slug: item.slug,
        price: item.price,
        colors: item.colors,
        sizes: item.sizes,
        imagesUrls: [item.colorImagesUrls[0].itemUrlList[0], item.colorImagesUrls[0].itemUrlList[1]],
      };

      const docRef = await setDoc(doc(db, `${collectionKey}/${docKey}/items-preview`, itemPreview.id), itemPreview);
    } catch (error) {
      console.log('error:', error);
    }
  });

  // create a search preview for each item
  items.forEach(async (item) => {
    try {
      const itemPreview: AllItemsPreview = {
        id: item.id,
        created: item.created,
        collectionKey,
        docKey,
        productName: item.productName,
        slug: item.slug,
        price: item.price,
        imagesUrls: [item.colorImagesUrls[0].itemUrlList[0]],
      };

      const docRef = await setDoc(doc(db, 'all-items-search', itemPreview.id.toString()), itemPreview);
    } catch (error) {
      console.log('error:', error);
    }
  });

  // create a stock preview for each item
  items.forEach(async (item) => {
    try {
      const itemPreview: ItemsSizePreview = {
        id: item.id,
        created: item.created,
        collectionKey,
        docKey,
        productName: item.productName,
        imagesUrls: [item.colorImagesUrls[0].itemUrlList[0]],
        stock: item.stock,
      };

      const docRef = await setDoc(doc(db, `${collectionKey}/${docKey}/items-stock`, itemPreview.id.toString()), itemPreview);
    } catch (error) {
      console.log('error:', error);
    }
  });
}

// delete images in addFirebase component
export async function deleteImageUrls(urlList: string[]) {
  urlList.forEach((url) => {
    const imageRef = ref(storageFB, url);
    deleteObject(imageRef)
      .catch((error) => {
        console.log('Failed to delete image: ', error);
      });
  });
}

// export type ObjectToAdd = {
//   title: string;
// };

// export type AddCollectionAndDocuments = [{
//   title:string,
//   items:[]
// }];

// COLLECTION AND DOC CREATION FUNCUNALITY
// need to specify the key in db as title
// export const addCollectionAndDocuments = async<T extends ObjectToAdd> (
//   collectionKey: string,
//   objectToAdd: T[],
// ): Promise<void> => {
//   const collectionRef = collection(db, collectionKey);
//   const batch = writeBatch(db);

//   objectToAdd.forEach((object) => {
//     const docRef = doc(collectionRef, object.title.toLowerCase());
//     batch.set(docRef, object);
//   });

//   await batch.commit();
//   console.log('done');
// };

// export type Keys = {
//   keys: string[];
// };

// export async function getCategoriesAndDocuments(): Promise<Map<string, Category[]>>; 
// export async function getCategoriesAndDocuments<CK extends string>(collectionKey: CK): Promise<Map<string, Category[]>>; 
// export async function getCategoriesAndDocuments(collectionKey?: string) {
//   let key = '';
//   if (!collectionKey) {
//     key = 'categories';
//   } else {
//     key = collectionKey;
//   }
//   const data = new Map<string, Category[]>();
//   const collectionRef = collection(db, key);
//   const q = query(collectionRef);
  
//   const querySnapshot = await getDocs(q);

//   const res = querySnapshot.docs.map((docSnapshot) => {
//     return docSnapshot.data() as Category;
//   });

//   data.set(key, res);
//   return data;
// }

export async function getPreviewCategoriesAndDocuments(collectionKey: string) {
  const userDocsKeys = await getUserKeysDocs(collectionKey);
  const previewArray: PreviewCategory[] = [];
  const data = new Map<string, PreviewCategory[]>();
  
  const fetchCategoryData = async (docKey: string) => {
    const collectionRef = collection(db, collectionKey, docKey, 'items-preview');
    const q = query(
      collectionRef,
      limit(4),
    );
    
    const querySnapshot = await getDocs(q);

    const previewCategoryItems: ItemPreview[] = querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot.data() as ItemPreview;
    });

    const newCategory:PreviewCategory = { title: docKey, items: previewCategoryItems };

    return newCategory;
  };

  await Promise.all(userDocsKeys.map(async (docKey) => {
    const newCategory = await fetchCategoryData(docKey);
    previewArray.push(newCategory);
  }));

  if (previewArray.length > 0) {
    data.set(collectionKey, previewArray);
  }
  return data;
}

export type CategoryDataState = {
  collectionMapKey: string,
  title: string,
  sliceItems: ItemPreview[]
};

// get the collection count to present in category down page
export async function getCategoryCount(collectionKey: string, docKey: string): Promise<number> {
  const subCollectionRef = collection(db, collectionKey, docKey, 'items-preview');
  const snapshot = await getCountFromServer(subCollectionRef);

  return snapshot.data().count;
}

// loading more data to category
export async function getSubCategoryDocument(collectionKey: string, docKey: string, skipItemsCounter: number, sortOption?: SortOption): Promise<CategoryDataState> {
  const subCollectionRef = collection(db, collectionKey, docKey, 'items-preview');
  let test:any = '';
  let next:any = '';

  if (sortOption?.sort.value) {
    if (sortOption.sort.value === 'recommended') {
      test = query(subCollectionRef, orderBy('created', 'asc'));
    }
    if (sortOption.sort.value === 'new') {
      test = query(subCollectionRef, orderBy('created', 'desc'));
    }
    if (sortOption.sort.value === 'price-low') {
      test = query(subCollectionRef, orderBy('price', 'asc'));
    }
    if (sortOption.sort.value === 'price-high') {
      test = query(subCollectionRef, orderBy('price', 'desc'));
    }
  } else {
    test = query(subCollectionRef, orderBy('created'));
  }
  console.log('sortOption:', sortOption, skipItemsCounter)
  // const orderedQuery = query(subCollectionRef, orderBy('created'));
  const documentSnapshots = await getDocs(test);
  const lastVisible = documentSnapshots.docs[skipItemsCounter];
  
  if (sortOption?.sort.value) {
    if (sortOption.sort.value === 'recommended') {
      next = query(
        collection(db, collectionKey, docKey, 'items-preview'),
        orderBy('created', 'asc'),
        startAt(lastVisible),
        limit(8),
      );
    }
    if (sortOption.sort.value === 'new') {
      next = query(
        collection(db, collectionKey, docKey, 'items-preview'),
        orderBy('created', 'desc'),
        startAt(lastVisible),
        limit(8),
      );
    }
    if (sortOption.sort.value === 'price-low') {
      next = query(
        collection(db, collectionKey, docKey, 'items-preview'),
        orderBy('price', 'asc'),
        startAt(lastVisible),
        limit(8),
      );
    }
    if (sortOption.sort.value === 'price-high') {
      next = query(
        collection(db, collectionKey, docKey, 'items-preview'),
        orderBy('price', 'desc'),
        startAt(lastVisible),
        limit(8),
      );
    }
  } else {
    next = query(
      collection(db, collectionKey, docKey, 'items-preview'),
      orderBy('created'),
      startAt(lastVisible),
      limit(8),
    );
  }
  

  const itemQuerySnapshot = await getDocs(next);

  const sliceItemsArray: ItemPreview[] = itemQuerySnapshot.docs.map((docSnapshot) => {
    const item = docSnapshot.data() as ItemPreview;
    return item;
  });

  console.log('sliceItemsArray:', sliceItemsArray)
  const categoryData: CategoryDataState = {
    collectionMapKey: collectionKey,
    title: docKey,
    sliceItems: sliceItemsArray,
  };
  return categoryData;
}

// initial load of category
export async function getCategory(collectionKey: string, docKey: string, sortOption?: SortOption): Promise<Map<string, PreviewCategory[]>> {
  const data = new Map<string, PreviewCategory[]>();
  const collectionRef = collection(db, collectionKey, docKey, 'items-preview');
  let test:any = '';

  if (sortOption?.sort.value) {
    if (sortOption.sort.value === 'recommended') {
      test = query(collectionRef, orderBy('created', 'asc'), limit(8));
    }
    if (sortOption.sort.value === 'new') {
      test = query(collectionRef, orderBy('created', 'desc'), limit(8));
    }
    if (sortOption.sort.value === 'price-low') {
      test = query(collectionRef, orderBy('price', 'asc'), limit(8));
    }
    if (sortOption.sort.value === 'price-high') {
      test = query(collectionRef, orderBy('price', 'desc'), limit(8));
    }
  } else {
    test = query(collectionRef, orderBy('created'), limit(8));
  }
  const itemQuerySnapshot = await getDocs(test);
  const result: ItemPreview[] = itemQuerySnapshot.docs.map((doc) => doc.data() as ItemPreview);

  data.set(collectionKey, [{
    title: docKey,
    items: result,
  }]);
  return data;
}

// get all items search
export async function getItemsSearch(): Promise<AllItemsPreview[]> {
  const collectionRef = collection(db, 'all-items-search');

  const itemsQuery = query(collectionRef, orderBy('id'));
  const itemsQuerySnapshot = await getDocs(itemsQuery);
  const result: AllItemsPreview[] = itemsQuerySnapshot.docs.map((doc) => doc.data() as AllItemsPreview);

  return result;
}

// featch item when using click direct link or typing path in broswer search (singel item)
export async function getItemFromRoute(collectionKey: string, docKey: string, itemId: string): Promise<NewItemValues | undefined> {
  const collectionRef = collection(db, collectionKey, docKey, 'items');
  const itemQuery = query(collectionRef, where('id', '==', itemId));
  const itemQuerySnapshot = await getDocs(itemQuery);

  if (itemQuerySnapshot.docs.length > 0) {
    const CategoryItem = itemQuerySnapshot.docs[0].data() as NewItemValues;
    return CategoryItem;
  }
}

/* 
db structure
{
  hats: {
    title: 'Hats',
    items: [
      {},
      {}
    ]
  },
  sneakers: {
    title: 'Sneakers',
    items: [
      {},
      {}
    ]
  }
}
 */

// USER AUTH FUNCTIONLITY

export type UserData = {
  createdAt: Date;
  displayName: string;
  email: string;
};

export type Address = {
  firstName: string;
  lastName: string;
  mobile: number;
  country: string;
  address: string;
  city: string;
  state?: string;
  postcode: number;
};

export type AddittionalInformation = {
  firstName: string;
  lastName: string;
  displayName?: string;
  dateOfBirth: Date | null;
  sendNotification: boolean;
  userAddresses?: Address[];
  userOrders?: number[];
};

export const createUserDocumentFromAuth = async (
  userAuth: User,
  addittionalInformation = {} as AddittionalInformation,
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  if (!userAuth) return;
  
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);
  
  // if user data does not exists
  // create/set the document with the data from userAuth in my collection
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createAt,
        ...addittionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error);
    }
  }
  // if user data exists
  // return userDocRef
  return userSnapshot as QueryDocumentSnapshot<UserData>;
};

export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email: string, password: string) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject,
    );
  });
};


// NEED TO TYPE THIS ORDER CREATING
export const createNewOrderDocument = async (newOrderDetails: NewOrderDetails) => {
  if (!newOrderDetails) return;
  
  await setDoc(doc(db, 'orders', newOrderDetails.orderId.toString()), newOrderDetails);
  console.log('done');
};
