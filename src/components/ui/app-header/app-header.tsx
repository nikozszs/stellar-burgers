import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const formatUserName = (name: string | undefined) => {
    if (!name) return 'Личный кабинет';
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={'/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </p>
              </>
            )}
          </NavLink>
          <NavLink
            to={'/feed'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <NavLink
          to={'/profile'}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <div className={styles.link_position_last}>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>
                {formatUserName(userName)}
              </p>
            </div>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
