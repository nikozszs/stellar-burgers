import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/slices/ingredientSlice';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const indredients = useSelector(selectIngredients);

  const ingredientData = indredients.find(
    (item: TIngredient) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
