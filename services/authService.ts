import { supabase } from '../supabaseClient';

export interface LocalUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const authService = {
  /**
   * Safe session retrieval with internal error handling
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!data.session?.user) {
        return null;
      }
      return data.session;
    } catch (err: any) {
      console.warn("[authService] Session retrieval failed:", err.message);
      return null;
    }
  },

  /**
   * Checks if a profile exists for a given email
   */
  checkUserExists: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      
      if (error) return false;
      return !!data;
    } catch (err) {
      return false;
    }
  },

  signIn: async (email: string, password?: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password || 'password123'
      });
      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (e: any) {
      console.error("[Auth] SignIn error:", e);
      let msg = e.message;
      if (msg === 'Failed to fetch' || e.name === 'TypeError') {
        msg = "Connexion au serveur impossible. Vérifiez votre accès internet.";
      }
      return { user: null, session: null, error: msg };
    }
  },

  signUp: async (email: string, password?: string) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password || 'password123',
        options: { 
          data: { 
            full_name: email.split('@')[0],
            email: trimmedEmail 
          },
          emailRedirectTo: window.location.origin 
        }
      });
      if (error) throw error;
      
      return { user: data.user, session: data.session, error: null };
    } catch (e: any) {
      console.error("[Auth] SignUp error:", e);
      let msg = e.message;
      if (msg === 'Failed to fetch' || e.name === 'TypeError') {
        msg = "Le serveur est inaccessible. Veuillez réessayer dans quelques instants.";
      }
      return { user: null, session: null, error: msg };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      console.error("[Auth] SignOut error:", err);
      localStorage.clear();
    }
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'TOKEN_REFRESHED'].includes(event)) {
          callback(session);
        }
      });
      return subscription;
    } catch (err) {
      console.error("[authService] Failed to subscribe to auth changes:", err);
      return null;
    }
  }
};