import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .limit(1);

  if (error) {
    console.error('Error conectando con Supabase:', error);
    return false;
  }

  console.log('Supabase conectado correctamente:', data);
  return true;
}