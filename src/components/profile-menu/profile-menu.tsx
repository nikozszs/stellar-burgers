import { FC, SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(logoutUser()).unwrap();
      if (result === null) {
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
