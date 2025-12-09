export interface SupplyItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Supply {
  _id?: string;
  items: SupplyItem[];
  grandTotal: number;
  createdAt?: string;
}
