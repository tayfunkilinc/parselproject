import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Parcel {
  id?: string;
  ada_no: string;
  parsel_no: string;
  il?: string;
  ilce?: string;
  mahalle?: string;
  coordinates?: number[][];
  created_at?: string;
  user_id?: string;
}
