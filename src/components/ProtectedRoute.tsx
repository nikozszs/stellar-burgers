import { FC, JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: JSX.Element;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const location = useLocation();
  const isAuthenticated = false;

  // Если роут только для неавторизованных, а пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Если роут защищённый, а пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
