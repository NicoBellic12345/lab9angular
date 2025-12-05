export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  actors: string[];
  rating: number;
}

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  errorDetails: string | null;
}

export const initialState: ItemsState = {
  items: [],
  selectedItem: null,
  loading: false,
  loadingDetails: false,
  error: null,
  errorDetails: null
};