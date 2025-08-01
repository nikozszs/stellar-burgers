import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/slices/userSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        registerUser({ email, name: userName, password })
      ).unwrap();

      if (result.name) {
        navigate(location.state?.from || '/profile', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      navigate(location.state?.from || '/profile', { replace: true });
    }
  }, [user, isLoading, navigate, location.state]);

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
