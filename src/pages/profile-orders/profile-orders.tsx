import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const { orders } = useSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
