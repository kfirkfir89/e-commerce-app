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
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { Category, CategoryItem } from '../../store/categories/category.types';    
import { NewOrderDetails } from '../../store/orders/order.types';

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
export const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

// COLLECTION AND DOC CREATION FUNCUNALITY
// need to specify the key in db as title
export type ObjectToAdd = {
  title: string;
};

export type AddCollectionAndDocuments = [{
  title:string,
  items:CategoryItem[]
}];

export const addCollectionAndDocuments = async<T extends ObjectToAdd> (
  collectionKey: string,
  objectToAdd: T[],
): Promise<void> => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);
  console.log('fdddddddddddddd', objectToAdd);


  objectToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export async function getCategoriesAndDocuments(): Promise<Category[]>; 
export async function getCategoriesAndDocuments<CK extends string>(collectionKey: CK): Promise<Category[]>; 
export async function getCategoriesAndDocuments(collectionKey?: string) {
  let key = '';
  if (!collectionKey) {
    key = 'categories';
  } else {
    key = collectionKey;
  }

  const collectionRef = collection(db, key);
  const q = query(collectionRef);
  
  const querySnapshot = await getDocs(q);
  console.log('FIREBASESNAP:', querySnapshot);

  return querySnapshot.docs.map(
    (docSnapshot) => docSnapshot.data() as Category,
  );
}

// export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
//   const collectionRef = collection(db, 'categories');
//   const q = query(collectionRef);
  
//   const querySnapshot = await getDocs(q);

//   return querySnapshot.docs.map(
//     (docSnapshot) => docSnapshot.data() as Category,
//   );
// };


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
