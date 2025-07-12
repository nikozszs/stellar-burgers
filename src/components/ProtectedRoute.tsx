import { FC, JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: JSX.Element;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const location = useLocation();
  const { user, isInit } = useSelector((state) => state.user);

  // Если проверка аутентификации еще не завершена
  if (!isInit) return <Preloader />;

  // Если маршрут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Если роут защищённый, а пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
