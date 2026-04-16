import { RouterProvider } from 'react-router';
import { router } from './routes';
import { supabase } from '../lib/supabase';

// Connection Test: This tries to read your complaints table
supabase
  .from('complaints')
  .select('*')
  .then((res) => {
    if (res.error) {
      console.error('❌ Connection Error:', res.error.message);
    } else {
      console.log('✅ Database Connected! Your data:', res.data);
    }
  });
export default function App() {
  return <RouterProvider router={router} />;
}