import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  products: {
    Row: {
      id: string;
      name: string;
      price: number;
      original_price: number | null;
      category: string;
      image: string;
      images: string[];
      description: string;
      rating: number;
      reviews: number;
      stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
      specs: Record<string, string>;
      is_featured: boolean;
      created_at: string;
      updated_at: string;
    };
  };
};
