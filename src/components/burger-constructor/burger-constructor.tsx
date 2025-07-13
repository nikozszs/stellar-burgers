import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorItemsSlice';
import {
  clearCurrentOrder,
  createOrder,
  selectCurrentOrder,
  selectOrderRequest
} from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { bun, ingredients } = useSelector((state) => state.constructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectCurrentOrder);
  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return false;
    }

    if (!bun || orderRequest) return;

    const orderIngredients = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(orderIngredients));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearCurrentOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
