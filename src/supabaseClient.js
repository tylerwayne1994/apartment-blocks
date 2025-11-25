import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlephoghfslyleyuorah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZXBob2doZnNseWxleXVvcmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNDIyNDksImV4cCI6MjA3ODgxODI0OX0.piBA3XddZS0OoTXLBbTKM2sJ9eTO_Hipk2y2I6uu99Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
