import { supabase } from '../supabaseClient';

export const isAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🔐 Checking admin status for user:', user?.email);
    
    if (!user) {
      console.log('❌ No user logged in');
      return false;
    }
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    console.log('👤 Profile data:', profile);
    console.log('🔑 User role:', profile?.role);
    
    if (error) {
      console.error('❌ Error fetching profile:', error);
    }
    
    const adminStatus = profile?.role === 'admin';
    console.log(adminStatus ? '✅ USER IS ADMIN' : '❌ User is NOT admin');
    
    return adminStatus;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getUserRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    return profile?.role || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};
