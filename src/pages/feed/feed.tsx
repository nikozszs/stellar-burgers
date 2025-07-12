import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchAllOrders,
  selectFeedOrders
} from '../../services/slices/orderSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(selectFeedOrders);

  useEffect(() => {
    const getOrderFeed = async () => {
      try {
        await dispatch(fetchAllOrders()).unwrap();
      } catch (error) {
        console.error(error);
      }
    };
    getOrderFeed();
  }, [dispatch]);

  const handleGetFeeds = async () => {
    try {
      await dispatch(fetchAllOrders()).unwrap();
    } catch (err) {
      console.error('Ошибка обновления заказов:', err);
    }
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
