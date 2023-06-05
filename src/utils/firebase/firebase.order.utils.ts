import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { NewOrderDetails } from '../../store/orders/order.types';
import { db } from './firebase.utils';

// NEED TO TYPE THIS ORDER CREATING
export const createNewOrderDocument = async (
  newOrderDetails: NewOrderDetails
) => {
  console.log('newOrderDetails:', newOrderDetails);
  if (!newOrderDetails) return;

  await setDoc(
    doc(db, 'orders', newOrderDetails.orderId.toString()),
    newOrderDetails
  );

  const userDocRef = doc(db, 'users', newOrderDetails.user.uid);
  try {
    await updateDoc(userDocRef, {
      orders: arrayUnion(newOrderDetails.orderId),
    });
  } catch (error) {
    console.error('Error updating document: ', error);
  }

  console.log('done');
};

export const getUserOrders = async (orderIds: string[]) => {
  const collectionRef = collection(db, 'orders');

  const itemsQuery = query(collectionRef, where('orderId', 'in', orderIds));
  const itemsQuerySnapshot = await getDocs(itemsQuery);
  const result: NewOrderDetails[] = itemsQuerySnapshot.docs.map(
    (doc) => doc.data() as NewOrderDetails
  );
  return result;
};
