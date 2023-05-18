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
  query,
  getDocs,
  QueryDocumentSnapshot,
  orderBy,
  limit,
  where,
  startAt,
  getCountFromServer,
  Query,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { PreviewCategory } from '../../store/categories/category.types';    
import { NewOrderDetails } from '../../store/orders/order.types';
import { AddFirebaseData } from '../../components/add-firebase/add-firebase.component';
import {
  ItemPreview, NewItemValues, 
} from '../../components/add-firebase/add-item.component';
import { SortOption } from '../../routes/category/category.component';
import { ColorStock, SizeStock } from '../../components/add-firebase/add-item-stock.component';



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
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider).catch((error) => alert(error.message));
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
  console.log('collectionKey:', collectionKey, docKey, items);
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
      const totalStockInit = item.stock.reduce((total: number, sizeStock: SizeStock) => {
        sizeStock.colors.forEach((colorStock: ColorStock) => {
          // eslint-disable-next-line no-param-reassign
          total += colorStock.count;
        });
        return total;
      }, 0);
      
      const itemPreview: ItemPreview = {
        id: item.id,
        created: item.created,
        collectionKey,
        docKey,
        productName: item.productName,
        slug: item.slug,
        price: item.price,
        colors: item.colors,
        colorsSort: item.colors.map((color) => (color.label)),
        sizesSort: item.sizes.map((size) => (size.value)),
        stock: item.stock,
        initTotalStock: totalStockInit,
        totalStock: totalStockInit,
        discaount: item.discaount,
        imagesUrls: [item.colorImagesUrls[0].itemUrlList[0], item.colorImagesUrls[0].itemUrlList[1]],
      };

      const docRef = await setDoc(doc(db, `${collectionKey}/${docKey}/items-preview`, itemPreview.id), itemPreview);
      const docRefAll = await setDoc(doc(db, 'all-items-preview', itemPreview.id.toString()), itemPreview);
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

// get preview items for each category for main category page(preview page)
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

// 
export type CategoryDataSlice = {
  collectionMapKey: string,
  title: string,
  sliceItems: ItemPreview[]
  count: number
};

// loading more data to category
export async function getSubCategoryDocument(collectionKey: string, docKey: string, itemsCounter: number, sortOption: SortOption, prevSortOption: SortOption): Promise<CategoryDataSlice> {
  const collectionRef = collection(db, collectionKey, docKey, 'items-preview');
  function equalSortsObjects(sortOption: SortOption, prevSortOption: SortOption): boolean {
    if (JSON.stringify(sortOption.sort) === JSON.stringify(prevSortOption.sort) 
      && JSON.stringify(sortOption.sizes) === JSON.stringify(prevSortOption.sizes)
      && JSON.stringify(sortOption.colors) === JSON.stringify(prevSortOption.colors)) {
      return true;
    }
    return false;
  }
  const isSameSort = equalSortsObjects(sortOption, prevSortOption);
  let skipItemsCounter = 0;
  if (!isSameSort) {
    skipItemsCounter = 0;
  } else {
    skipItemsCounter = itemsCounter;
  }
  
  
  // options of sizes selected
  if (sortOption && sortOption.sizes.length > 0) {
    const sortOptionsSizes = sortOption.sizes.map((size) => (size.value));
    
    const itemsQuery = query(collectionRef, where('sizesSort', 'array-contains-any', sortOptionsSizes));
    const itemsSnapshot = await getDocs(itemsQuery);
    const itemsSortBySizes = itemsSnapshot.docs.map((doc) => doc.data() as ItemPreview);
    let sortCount = itemsSortBySizes.length;

    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        itemsSortBySizes.sort((a, b) => a.created.toMillis() - b.created.toMillis());
      }
      if (sortOption.sort.value === 'new') {
        itemsSortBySizes.sort((a, b) => b.created.toMillis() - a.created.toMillis());
      }
      if (sortOption.sort.value === 'price-low') {
        itemsSortBySizes.sort((a, b) => a.price - b.price);
      }
      if (sortOption.sort.value === 'price-high') {
        itemsSortBySizes.sort((a, b) => b.price - a.price);
      }
    }

    // when colors selected filter after the sizes
    if (sortOption.colors.length > 0) {
      const filteredByColors = itemsSortBySizes
        .filter((item) => item.stock
          .some((sizeStock) => sizeStock.colors
            .some((colorStock) => sortOption.colors
              .some((sortColor) => sortColor.label === colorStock.label) && colorStock.count > 0)));
      
      sortCount = filteredByColors.length;
      const slice = filteredByColors.slice(skipItemsCounter, skipItemsCounter + 3);

      const categoryData: CategoryDataSlice = {
        collectionMapKey: collectionKey,
        title: docKey,
        sliceItems: slice,
        count: sortCount,
      };
      return categoryData;
    }

    const slice = itemsSortBySizes.slice(skipItemsCounter, skipItemsCounter + 3);
    const categoryData: CategoryDataSlice = {
      collectionMapKey: collectionKey,
      title: docKey,
      sliceItems: slice,
      count: sortCount,
    };
    return categoryData;
  }
  
  // options of colors selected
  if (sortOption && sortOption.colors.length > 0) {
    const sortOptionsColor = sortOption.colors.map((color) => (color.label));

    const itemsQuery = query(collectionRef, where('colorsSort', 'array-contains-any', sortOptionsColor));
    const itemsSnapshot = await getDocs(itemsQuery);
    const itemsSortByColors = itemsSnapshot.docs.map((doc) => doc.data() as ItemPreview);
    const sortCount = itemsSortByColors.length;

    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        itemsSortByColors.sort((a, b) => a.created.toMillis() - b.created.toMillis());
      }
      if (sortOption.sort.value === 'new') {
        itemsSortByColors.sort((a, b) => b.created.toMillis() - a.created.toMillis());
      }
      if (sortOption.sort.value === 'price-low') {
        itemsSortByColors.sort((a, b) => a.price - b.price);
      }
      if (sortOption.sort.value === 'price-high') {
        itemsSortByColors.sort((a, b) => b.price - a.price);
      }
    }

    const categoryData: CategoryDataSlice = {
      collectionMapKey: collectionKey,
      title: docKey,
      sliceItems: itemsSortByColors.slice(skipItemsCounter, skipItemsCounter + 3),
      count: sortCount,
    };

    return categoryData;
  }

  // same sort mean load more check for main sort desc/asc
  if (isSameSort) {
    let itemsQuery:Query<DocumentData> = query(collectionRef);
    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        itemsQuery = query(
          collectionRef,
          orderBy('created', 'asc'),
        );
      }
      if (sortOption.sort.value === 'new') {
        itemsQuery = query(
          collectionRef,
          orderBy('created', 'desc'),
        );
      }
      if (sortOption.sort.value === 'price-low') {
        itemsQuery = query(
          collectionRef,
          orderBy('price', 'asc'),
        );
      }
      if (sortOption.sort.value === 'price-high') {
        itemsQuery = query(
          collectionRef,
          orderBy('price', 'desc'),
        );
      }
    } 
    let next:Query<DocumentData>;
    const itemsSnapshot = await getDocs(itemsQuery);
    const sortCount = (await getCountFromServer(itemsQuery)).data().count;
    const lastVisible = itemsSnapshot.docs[skipItemsCounter];

    next = query(
      collection(db, collectionKey, docKey, 'items-preview'),
      startAt(lastVisible),
      limit(3),
    );
    
    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('created', 'asc'),
          startAt(lastVisible),
          limit(3),
        );
      }
      if (sortOption.sort.value === 'new') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('created', 'desc'),
          startAt(lastVisible),
          limit(3),
        );
      }
      if (sortOption.sort.value === 'price-low') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('price', 'asc'),
          startAt(lastVisible),
          limit(3),
        );
      }
      if (sortOption.sort.value === 'price-high') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('price', 'desc'),
          startAt(lastVisible),
          limit(3),
        );
      }
    }


    const itemQuerySnapshot = await getDocs(next);
  
    const sliceItemsArray: ItemPreview[] = itemQuerySnapshot.docs.map((docSnapshot) => {
      const item = docSnapshot.data() as ItemPreview;
      return item;
    });

    const categoryData: CategoryDataSlice = {
      collectionMapKey: collectionKey,
      title: docKey,
      sliceItems: sliceItemsArray,
      count: sortCount,
    };
    return categoryData;
  }

  // in case of changing sort without sort option of colors or sizes
  let itemsQuery:Query<DocumentData> = query(collectionRef);
    
  if (sortOption?.sort.value) {
    if (sortOption.sort.value === 'recommended') {
      itemsQuery = query(
        collectionRef,
        orderBy('created', 'asc'),
        limit(3),
      );
    }
    if (sortOption.sort.value === 'new') {
      itemsQuery = query(
        collectionRef,
        orderBy('created', 'desc'),
        limit(3),
      );
    }
    if (sortOption.sort.value === 'price-low') {
      itemsQuery = query(
        collectionRef,
        orderBy('price', 'asc'),
        limit(3),
      );
    }
    if (sortOption.sort.value === 'price-high') {
      itemsQuery = query(
        collectionRef,
        orderBy('price', 'desc'),
        limit(3),
      );
    }
  }

  const itemsSnapshot = await getDocs(itemsQuery);
  const sortCount = (await getCountFromServer(collectionRef)).data().count;
  const sliceItemsArray: ItemPreview[] = itemsSnapshot.docs.map((docSnapshot) => {
    const item = docSnapshot.data() as ItemPreview;
    return item;
  });
  
  const categoryData: CategoryDataSlice = {
    collectionMapKey: collectionKey,
    title: docKey,
    sliceItems: sliceItemsArray,
    count: sortCount,
  };
  return categoryData;
}

// get all items search
export async function getItemsSearch(): Promise<ItemPreview[]> {
  const collectionRef = collection(db, 'all-items-preview');

  const itemsQuery = query(collectionRef, orderBy('id'));
  const itemsQuerySnapshot = await getDocs(itemsQuery);
  const result: ItemPreview[] = itemsQuerySnapshot.docs.map((doc) => doc.data() as ItemPreview);

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

export async function getCategoryCount(collectionKey: string, docKey: string): Promise<number> {
  const subCollectionRef = collection(db, collectionKey, docKey, 'items-preview');
  const snapshot = await getCountFromServer(subCollectionRef);

  return snapshot.data().count;
}

// USER AUTH FUNCTIONLITY

export type UserData = {
  createdAt: Timestamp
  displayName: string
  email: string
} & AddittionalInformation;


export type AddittionalInformation = {
  firstName: string
  lastName: string
  dateOfBirth: Timestamp
  sendNotification: boolean
  addresses: Address[]
  orders: string[]
  favoriteProducts: string[]
  isAdmin: boolean
};

export type Address = {
  firstName: string
  lastName: string
  mobile: number
  country: string
  address: string
  city: string
  state?: string
  postcode: number
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
    const createAt = Timestamp.fromDate(new Date());
    try {
      await setDoc(userDocRef, {
        displayName: displayName || `${addittionalInformation.firstName} ${addittionalInformation.lastName}`,
        email,
        createAt,
        ...addittionalInformation,
      });
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('error creating the user', error);
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
