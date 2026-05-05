/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Oversize Linen Blend Shirt',
    price: 3999,
    originalPrice: 5499,
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621072156002-e2fcced0b170?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A premium linen blend shirt designed for maximum comfort and style. Features a relaxed fit and breathable fabric.',
    rating: 4.8,
    reviews: 124,
    stockStatus: 'In Stock',
    specs: { Material: '55% Linen, 45% Cotton', Fit: 'Oversized', "Care Instructions": 'Machine wash cold' },
    isFeatured: true
  },
  {
    id: '2',
    name: 'Stretchy Oxford Shirt',
    price: 3499,
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Classic Oxford shirt with a modern stretch twist.',
    rating: 4.5,
    reviews: 89,
    stockStatus: 'In Stock',
    specs: { Material: '98% Cotton, 2% Elastane', Fit: 'Slim', "Care Instructions": 'Iron easy' },
    isFeatured: true
  },
  {
    id: '3',
    name: 'Premium Wool Overcoat',
    price: 14999,
    originalPrice: 19999,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1544022613-e87ed35a62a6?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ed35a62a6?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Elegant wool overcoat for the sophisticated minimalist.',
    rating: 4.9,
    reviews: 56,
    stockStatus: 'Low Stock',
    specs: { Material: '100% Virgin Wool', Lining: 'Viscose', Finish: 'Water-repellant' },
    isFeatured: true
  },
  // Add more items for a total of 12 distinct styled items
  {
    id: '4',
    name: 'Slim Fit Denim Jeans',
    price: 5999,
    category: 'Pants',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop'],
    description: 'High-quality denim with a perfect slim fit.',
    rating: 4.6,
    reviews: 210,
    stockStatus: 'In Stock',
    specs: { Material: '98% Cotton, 2% Spandex', Fit: 'Slim' }
  },
  {
    id: '5',
    name: 'Classic White Sneakers',
    price: 6999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop'],
    description: 'Minimalist leather sneakers for any occasion.',
    rating: 4.8,
    reviews: 350,
    stockStatus: 'In Stock',
    specs: { Material: 'Full Grain Leather', Sole: 'Rubber' }
  },
  {
    id: '6',
    name: 'Leather Weekend Bag',
    price: 12499,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
    description: 'Spacious and durable leather bag for travel.',
    rating: 4.9,
    reviews: 45,
    stockStatus: 'Low Stock',
    specs: { Material: 'Premium Cowhide Leather', Capacity: '35L' }
  },
  {
    id: '7',
    name: 'Chino Trousers',
    price: 4499,
    category: 'Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop'],
    description: 'Comfortable cotton chinos in a classic cut.',
    rating: 4.5,
    reviews: 167,
    stockStatus: 'In Stock',
    specs: { Material: '100% Cotton Twill', Fit: 'Regular' }
  },
  {
    id: '8',
    name: 'Harrington Jacket',
    price: 9999,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
    description: 'The iconic Harrington jacket, redefined.',
    rating: 4.7,
    reviews: 82,
    stockStatus: 'In Stock',
    specs: { Material: 'Cotton Blend', Lining: 'Tartan' }
  },
  ...Array.from({ length: 22 }).map((_, i) => {
    const id = (i + 9).toString();
    const imageLinks = [
      'https://images.unsplash.com/photo-1523381235212-d73f4a382182',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'
    ];
    const image = imageLinks[i % imageLinks.length] + '?q=80&w=800&auto=format&fit=crop';
    return {
      id,
      name: `Essence Item #${id}`,
      price: 2499 + (i * 200),
      category: ['Shirts', 'Pants', 'Accessories', 'Outerwear'][i % 4],
      image: image,
      images: [image],
      description: 'Modern essentials designed for every day.',
      rating: Number((4.2 + (Math.random() * 0.7)).toFixed(1)),
      reviews: 10 + Math.floor(Math.random() * 100),
      stockStatus: 'In Stock' as const,
      specs: { Material: 'Fine Blend', Style: 'Modern Casual' }
    };
  })
];
