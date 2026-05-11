export type MenuItem = {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderLine = {
  id: number;
  orderId: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  createdAt: string;
  total: number;
  items: OrderLine[];
};

export type CartLine = {
  item: MenuItem;
  quantity: number;
};
