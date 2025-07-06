export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiUpdateProductResponse {
  message: string;
  updatedProduct: Product;
}
export interface ApiCreateProductResponse {
  message: string;
  newProduct: Product;
}
