/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  specs: { [key: string]: string };
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
