import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../ProtectedRoute';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientSlice';
import { useAppDispatch } from '../../services/store';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navidate = useNavigate();
  const dispatch = useAppDispatch();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => navidate(-1);

  if (isLoading) return <div>Загрузка ингредиентов...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (ingredients.length === 0) return <div>Нет доступных ингредиентов</div>;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        >
          <Route path='orders' element={<ProfileOrders />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <ProtectedRoute onlyUnAuth element={<OrderInfo />} />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
