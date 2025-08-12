import { initialState as ingredientsInitialState } from '../../services/slices/ingredientSlice';
import { initialState as constructorInitialState } from '../../services/slices/constructorItemsSlice';
import { initialState as orderInitialState } from '../../services/slices/orderSlice';
import { initialState as userInitialState } from '../../services/slices/userSlice';
import { rootReducer, RootState } from '../../services/store';

describe('rootReducer', () => {
  test('должен возвращать начальное состояние при вызове с неопределенным состоянием и неизвестным действием', () => {
    const expectInitialState: RootState = {
      ingredients: ingredientsInitialState,
      constructorItems: constructorInitialState,
      order: orderInitialState,
      user: userInitialState
    };
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(expectInitialState);
  });
  test('не должен изменять состояние при неизвестном действии', () => {
    const testState = {
      ingredients: ingredientsInitialState,
      constructorItems: constructorInitialState,
      order: orderInitialState,
      user: userInitialState
    };
    const result = rootReducer(testState, { type: 'UNKNOWN_ACTION' });
    expect(result).toBe(testState);
  });
});
