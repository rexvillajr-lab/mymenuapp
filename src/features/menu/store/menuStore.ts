import {create} from 'zustand';

import {
  addMenuItem,
  createOrder,
  deleteMenuItem,
  getMenuItems,
  getOrders,
  initializeDatabase,
  updateMenuItem,
} from '../data/menuDatabase';
import {CartLine, MenuItem, Order} from '../types/models';

type MenuItemPayload = {
  name: string;
  price: number;
};

type MenuState = {
  cart: Record<number, CartLine>;
  error: string | null;
  hasInitialized: boolean;
  isLoading: boolean;
  items: MenuItem[];
  orders: Order[];
  addToCart: (item: MenuItem) => void;
  clearCart: () => void;
  createMenuItem: (payload: MenuItemPayload) => Promise<void>;
  deleteMenuItem: (itemId: number) => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  initialize: () => Promise<void>;
  placeOrder: () => Promise<void>;
  removeFromCart: (itemId: number) => void;
  updateMenuItem: (itemId: number, payload: MenuItemPayload) => Promise<void>;
};

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

export const useMenuStore = create<MenuState>((set, get) => ({
  cart: {},
  error: null,
  hasInitialized: false,
  isLoading: false,
  items: [],
  orders: [],

  addToCart: item =>
    set(state => {
      const currentLine = state.cart[item.id];

      return {
        cart: {
          ...state.cart,
          [item.id]: {
            item,
            quantity: currentLine ? currentLine.quantity + 1 : 1,
          },
        },
      };
    }),

  clearCart: () => set({cart: {}}),

  createMenuItem: async payload => {
    set({error: null, isLoading: true});

    try {
      const item = await addMenuItem(payload);
      set(state => ({
        items: [...state.items, item].sort((first, second) =>
          first.name.localeCompare(second.name),
        ),
      }));
    } catch (error) {
      const message = toErrorMessage(error);
      set({error: message});
      throw new Error(message);
    } finally {
      set({isLoading: false});
    }
  },

  deleteMenuItem: async itemId => {
    set({error: null, isLoading: true});

    try {
      await deleteMenuItem(itemId);
      const items = await getMenuItems();
      set(state => {
        const nextCart = {...state.cart};
        delete nextCart[itemId];

        return {cart: nextCart, items};
      });
    } catch (error) {
      const message = toErrorMessage(error);
      set({error: message});
      throw new Error(message);
    } finally {
      set({isLoading: false});
    }
  },

  fetchMenuItems: async () => {
    set({error: null});

    try {
      const items = await getMenuItems();
      set({items});
    } catch (error) {
      const message = toErrorMessage(error);
      set({error: message});
      throw new Error(message);
    }
  },

  initialize: async () => {
    set({error: null, isLoading: true});

    try {
      await initializeDatabase();
      const [items, orders] = await Promise.all([getMenuItems(), getOrders()]);
      set({items, orders});
    } catch (error) {
      set({error: toErrorMessage(error)});
    } finally {
      set({hasInitialized: true, isLoading: false});
    }
  },

  placeOrder: async () => {
    const lines = Object.values(get().cart);

    if (lines.length === 0) {
      return;
    }

    set({error: null, isLoading: true});

    try {
      await createOrder(lines);
      const orders = await getOrders();
      set({cart: {}, orders});
    } catch (error) {
      set({error: toErrorMessage(error)});
    } finally {
      set({isLoading: false});
    }
  },

  removeFromCart: itemId =>
    set(state => {
      const currentLine = state.cart[itemId];

      if (!currentLine) {
        return state;
      }

      if (currentLine.quantity === 1) {
        const nextCart = {...state.cart};
        delete nextCart[itemId];
        return {cart: nextCart};
      }

      return {
        cart: {
          ...state.cart,
          [itemId]: {
            ...currentLine,
            quantity: currentLine.quantity - 1,
          },
        },
      };
    }),

  updateMenuItem: async (itemId, payload) => {
    set({error: null, isLoading: true});

    try {
      await updateMenuItem(itemId, payload);
      const items = await getMenuItems();
      const updatedItem = items.find(item => item.id === itemId);

      set(state => {
        if (!updatedItem || !state.cart[itemId]) {
          return {items};
        }

        return {
          items,
          cart: {
            ...state.cart,
            [itemId]: {
              ...state.cart[itemId],
              item: updatedItem,
            },
          },
        };
      });
    } catch (error) {
      const message = toErrorMessage(error);
      set({error: message});
      throw new Error(message);
    } finally {
      set({isLoading: false});
    }
  },
}));
