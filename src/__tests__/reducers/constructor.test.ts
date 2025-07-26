import { fetchIngredients, ingredientsReducer } from '../../services/slices/ingredientSlice';
import {
    constructorItemsReducer,
    initialState,
    addIngredient,
    removeIngredient
} from '../../services/slices/constructorItemsSlice';
import { IngredientsState } from '@utils-types';

export const initialIngredientsState: IngredientsState = {
    items: [],
    isLoading: false,
    error: null
};

const mockBun = {
    id: '643d69a5c3f7b9001cfa093c',
    _id: "643d69a5c3f7b9001cfa093c",
    name: "Краторная булка N-200i",
    type: "bun",
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png"
};

const mockFilling = {
    id: '643d69a5c3f7b9001cfa0941',
    _id: "643d69a5c3f7b9001cfa0941",
    name: "Биокотлета из марсианской Магнолии",
    type: "main",
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 4242,
    image: "https://code.s3.yandex.net/react/code/meat-01.png",
    image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png"
};

describe('sync actions', () => {
    test('добавление булки', () => {
        const action = addIngredient(mockBun);
        const result = constructorItemsReducer(initialState, action);

        expect(result.bun).toEqual(mockBun);
        expect(result.ingredients).toHaveLength(0);
    });
    test('добавление начинки', () => {
        const action = addIngredient(mockFilling);
        const result = constructorItemsReducer(initialState, action);

        expect(result.ingredients).toHaveLength(1);
        expect(result.ingredients[0]).toMatchObject({
            ...mockFilling,
            uuid: expect.any(String)
        });
    });
    test('удаление начинки', () => {
        const stateWithItems = {
            bun: mockBun,
            ingredients: [{ ...mockFilling, uuid: 'test-uuid' }]
        };
        const action = removeIngredient('test-uuid');
        const result = constructorItemsReducer(stateWithItems, action);

        expect(result.ingredients).toHaveLength(0);
        expect(result.bun).toEqual(mockBun);
    });
})

describe('async actions', () => {
    test('fetchIngredients.fulfilled', () => {
        const mockIngredients = [mockBun, mockFilling];
        const action = {
            type: fetchIngredients.fulfilled.type,
            payload: mockIngredients
        };
    
        const state = ingredientsReducer(initialIngredientsState, action);
        expect(state.items).toEqual(mockIngredients);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });
    test('fetchIngredients.pending', () => {
        const action = { type: fetchIngredients.pending.type };
        const state = ingredientsReducer(initialIngredientsState, action);
        
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });
    test('fetchIngredients.rejected', () => {
        const errorMessage = 'Failed to fetch';
        const action = {
            type: fetchIngredients.rejected.type,
            error: { message: errorMessage }
        };
        
        const state = ingredientsReducer(initialIngredientsState, action);
        
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
    });
})
