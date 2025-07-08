import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const handleIngredientClick = (ingredient: TIngredient) => {
    if (!ingredient?._id) {
      return;
    }
    navigate('/ingredients/${ingredient._id}', {
      state: { background: location }
    });
  };

  const buns: TIngredient[] = ingredients.filter(
    (item: TIngredient) => item.type === 'bun'
  );
  const mains: TIngredient[] = ingredients.filter(
    (item: TIngredient) => item.type === 'main'
  );
  const sauces: TIngredient[] = ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <div>Загрузка ингредиентов...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (ingredients.length === 0) return <div>Нет доступных ингредиентов</div>;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onIngredientClick={handleIngredientClick}
    />
  );
};
