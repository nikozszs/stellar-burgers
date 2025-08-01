export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrderState = {
  userOrders: TOrdersData;
  feedOrders: TOrdersData;
  currentOrder: TOrder | null;
  orderRequest: boolean;
  error: string | null;
  feedError: string | null;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}
