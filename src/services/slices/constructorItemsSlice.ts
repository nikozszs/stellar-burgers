import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => {
        return {
          payload: {
            ...ingredient,
            id: nanoid()
          }
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorItemsSlice.actions;

export const constructorItemsReducer = constructorItemsSlice.reducer;
export const {selectConstructorItems} = constructorItemsSlice.selectors;
