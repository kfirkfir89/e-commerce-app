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
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  orderBy,
  where,
  query,
  getDocs,
} from 'firebase/firestore';

import { UserDetailsFormFields } from '../../routes/user-profile/user-details.component';
import { db } from './firebase.utils';
import { ItemPreview } from '../../components/add-firebase/add-item.component';

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();

// USER AUTH FUNCTIONLITY

export type UserData = {
  createDate: Timestamp;
  displayName: string;
  email: string;
  uid: string;
} & AddittionalInformation;

export type AddittionalInformation = {
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  sendNotification: boolean;
  defualtAddressId: string;
  addresses: UserAddress[];
  orders: string[];
  favoriteProducts: string[];
  isAdmin: boolean;
};

export type UserAddress = {
  aid: string;
  firstName: string;
  lastName: string;
  mobile: number;
  country: string;
  address: string;
  city: string;
  state?: string;
  postcode: number;
};

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

// create user account all types of creation also connect with provider
export const createUserDocumentFromAuth = async (
  userAuth: User,
  addittionalInformation = {} as AddittionalInformation
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  // if user data does not exists
  // create/set the document with the data from userAuth in my collection
  if (!userSnapshot.exists()) {
    const { displayName, email, uid } = userAuth;
    const createDate = Timestamp.fromDate(new Date());
    let userAdditionalDetails: AddittionalInformation;

    if (
      addittionalInformation &&
      Object.keys(addittionalInformation).length === 0
    ) {
      const googleAdditionalDetails: AddittionalInformation = {
        firstName: '',
        lastName: '',
        dateOfBirth: Timestamp.fromDate(new Date()),
        sendNotification: true,
        defualtAddressId: '',
        addresses: [],
        orders: [],
        favoriteProducts: [],
        isAdmin: false,
      };
      userAdditionalDetails = googleAdditionalDetails;
    } else {
      userAdditionalDetails = addittionalInformation;
    }

    try {
      await setDoc(userDocRef, {
        displayName:
          displayName ||
          `${userAdditionalDetails.firstName} ${userAdditionalDetails.lastName}`,
        uid,
        email,
        createDate,
        ...userAdditionalDetails,
      });
    } catch (error) {
      // eslint-disable-next-line no-alert
      console.log('error creating the user', error);
    }

    const newUserSnapshot = await getDoc(userDocRef);

    return newUserSnapshot as QueryDocumentSnapshot<UserData>;
  }

  return userSnapshot as QueryDocumentSnapshot<UserData>;
};

// reset password
export const sendPasswordResetEmailFireBase = async (email: string) => {
  try {
    const actionCodeSettings = {
      url: 'http://localhost:5173/',
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// create user with email and password also sending verification
export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  const userCredentialres = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await sendEmailVerification(userCredentialres.user);
  return userCredentialres;
};

// signin an exsist user
export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

// user favortie update depend on if exsist or not ..if exsist remove if not add..
export const getUserFavorite = async (favoriteIds: string[]) => {
  const collectionRef = collection(db, 'all-items-preview');

  const itemsQuery = query(collectionRef, where('id', 'in', favoriteIds));
  const itemsQuerySnapshot = await getDocs(itemsQuery);
  const result: ItemPreview[] = itemsQuerySnapshot.docs.map(
    (doc) => doc.data() as ItemPreview
  );
  return result;
};

// user favortie update depend on if exsist or not ..if exsist remove if not add..
export const updateUserFavorite = async (itemId: string) => {
  if (auth.currentUser) {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const user = userSnapshot.data() as UserData;

      if (user.favoriteProducts.includes(itemId)) {
        try {
          await updateDoc(userDocRef, {
            favoriteProducts: arrayRemove(itemId),
          });
        } catch (error) {
          console.error('Error updating document: ', error);
        }
      } else {
        try {
          await updateDoc(userDocRef, {
            favoriteProducts: arrayUnion(itemId),
          });
        } catch (error) {
          console.error('Error updating document: ', error);
        }
      }
    }
  }
};
// update user doc
export const updateUserDocument = async (
  userDataForm: (
    | UserDetailsFormFields
    | UserAddress
    | { defualtAddressId: string }
    | { removeAddressId: string }
  ) & { uid: string }
): Promise<UserData | undefined> => {
  const userDocRef = doc(db, 'users', userDataForm.uid);
  const { uid, ...otherFields } = userDataForm;
  // string type mean defualt address change
  if ('defualtAddressId' in userDataForm) {
    try {
      await updateDoc(userDocRef, {
        defualtAddressId: userDataForm.defualtAddressId,
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
  // update the whole addresses array after delete or change
  if ('removeAddressId' in userDataForm) {
    console.log('userDataForm:', userDataForm);
    const userSnapshot = await getDoc(userDocRef);
    const user = userSnapshot.data() as UserData;
    const itemToRemove = user.addresses.find(
      (address) => address.aid === userDataForm.removeAddressId
    );

    try {
      await updateDoc(userDocRef, {
        addresses: arrayRemove(itemToRemove),
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
  // UserAddress type mean new address
  if ('address' in userDataForm) {
    try {
      await updateDoc(userDocRef, {
        addresses: arrayUnion(otherFields),
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
  // UserDetailsForm type mean user change his details
  if ('sendNotification' in userDataForm) {
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const user = userSnapshot.data() as UserData;
      const preEmail = user.email;
      try {
        await updateDoc(userDocRef, {
          firstName: userDataForm.firstName,
          lastName: userDataForm.lastName,
          dateOfBirth: userDataForm.dateOfBirth,
          email: userDataForm.email,
          sendNotification: userDataForm.sendNotification,
        });
        // checking if the email changed to update firebase auth and send vereficaiton
        if (preEmail !== userDataForm.email) {
          // Get current user
          const user = auth.currentUser;
          if (user) {
            // Update user email
            await updateEmail(user, userDataForm.email);
            // Send verification email to new email
            await sendEmailVerification(user);
          }
        }
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  }

  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    const user = userSnapshot.data() as UserData;
    return user;
  }
};

export const signOutUser = async () => signOut(auth);

// auth listener firebase
export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};
