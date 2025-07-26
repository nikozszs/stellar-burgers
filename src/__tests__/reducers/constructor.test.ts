import {
    constructorItemsReducer,
    initialState,
    addIngredient,
    removeIngredient,
    moveIngredient
} from '../../services/slices/constructorItemsSlice';

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

const mockMain = {
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

describe('constructorItemsSlice reducer', () => {
    test('initial state', () => {
        expect(constructorItemsReducer(undefined, { type: 'unknown' }))
        .toEqual(initialState);
    });
})

describe('addIngredient', () => {
    test('add bun', () => {
        const result = constructorItemsReducer(
        initialState,
        addIngredient(mockBun)
        );
        
        expect(result.bun).toMatchObject({
        ...mockBun,
        uuid: expect.any(String)
        });
        expect(result.ingredients).toHaveLength(0);
    });
    test('add main', () => {
        const result = constructorItemsReducer(
        initialState,
        addIngredient(mockMain)
        );
        
        expect(result.ingredients).toEqual([{
        ...mockMain,
        uuid: expect.any(String)
        }]);
        expect(result.bun).toBeNull();
    });
});

describe('removeIngredient', () => {
    test('remove main ', () => {
        const state = {
            bun: null,
            ingredients: [
                { ...mockMain, uuid: '1' },
                { ...mockMain, uuid: '2' }
            ]
        };
        const result = constructorItemsReducer(
            state,
            removeIngredient('1')
        );
        expect(result.ingredients).toEqual([{ ...mockMain, uuid: '2' }]);
    });
    test('состояние, если uuid не найден', () => {
        const state = {
            bun: null,
            ingredients: [
                { ...mockMain, uuid: '1' }
            ]
        };
        const result = constructorItemsReducer(
            state,
            removeIngredient('999')
        );
        expect(result).toEqual(state);
    });
});

describe('moveIngredient', () => {
    test('поменять местами начинки', () => {
        const state = {
            bun: null,
            ingredients: [
                { ...mockMain, uuid: '1' },
                { ...mockMain, uuid: '2' },
                { ...mockMain, uuid: '3' }
            ]
        };
        const result = constructorItemsReducer(
            state,
            moveIngredient({ fromIndex: 0, toIndex: 2 })
        );
        expect(result.ingredients.map(i => i.id))
        .toEqual(['2', '3', '1']);
    });
    test('если индексы равны', () => {
        const state = {
            bun: null,
            ingredients: [
                { ...mockMain, uuid: '1' },
                { ...mockMain, uuid: '2' }
            ]
        };
        const result = constructorItemsReducer(
            state,
            moveIngredient({fromIndex: 1, toIndex: 1})
        );
        expect(result).toEqual(state);
    });
});