export type Uuid = string;

export interface Product {
  uuid: Uuid;
  name: string;
  description: string;
  price: number;
}
