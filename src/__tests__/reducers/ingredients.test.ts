import {
  fetchIngredients,
  initialState,
  ingredientsReducer
} from '../../services/slices/ingredientSlice';

export const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    price: 4242,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png'
  }
];

describe('ingredientsSlice  reducer', () => {
  test('initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });
});

describe('fetchIngredients actions', () => {
  test('pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });
  test('fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null
    });
  });
  test('rejected', () => {
    const errorMessage = 'Network Error';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: errorMessage
    });
  });
});
