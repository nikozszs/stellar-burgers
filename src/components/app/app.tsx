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

const App = () => {
  const location = useLocation();
  const navidate = useNavigate();
  const handleModalClose = () => {
    navidate(-1);
  };
  const background = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
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
