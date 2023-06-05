import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { selectCurrentUser } from '../../store/user/user.selector';
import { NewOrderDetails } from '../../store/orders/order.types';
import { getUserOrders } from '../../utils/firebase/firebase.order.utils';

const UserOrders = () => {
  const dispatch = useDispatch();
  const currentUserSelector = useSelector(selectCurrentUser);
  const [userOrders, setUserOrders] = useState<NewOrderDetails[]>([]);

  const fetchUserOrders = useCallback(async () => {
    if (!currentUserSelector) return;
    try {
      const res = await getUserOrders(currentUserSelector.orders);
      setUserOrders(res);
    } catch (error) {
      console.log('error:', error);
    }
  }, [currentUserSelector]);

  useEffect(() => {
    const res = fetchUserOrders();
  }, [currentUserSelector, fetchUserOrders]);

  return (
    <div>
      {userOrders.map((order) => (
        <div key={order.orderId} className="flex flex-col p-4">
          <span>{order.createDate.toDate().toLocaleString()}</span>
          <span>{order.isExpressDelivery}</span>
          <span>{order.orderId}</span>
          <span>{order.orderStatus}</span>
          <span>{order.user.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
