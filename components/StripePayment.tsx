import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CreditCard, Loader2 } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const StripePayment: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Récupérer l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Veuillez vous connecter pour acheter des crédits.");
        setLoading(false);
        return;
      }

      // 2. Ton URL de Payment Link Stripe
      const stripePaymentLink = "https://buy.stripe.com/test_00weVd2VWgwdgJ8bB38Zq00";

      // 3. On ajoute l'ID de l'utilisateur en paramètre pour le Webhook Supabase
      // On utilise 'client_reference_id' pour que Stripe le renvoie à ton backend
      const finalUrl = `${stripePaymentLink}?client_reference_id=${user.id}`;

      // 4. Redirection directe
      window.location.href = finalUrl;

    } catch (err) {
      console.error("Erreur redirection:", err);
      alert("Une erreur est survenue lors de la redirection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-800 shadow-xl active:scale-[0.98] disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Redirection...
        </>
      ) : (
        <>
          <CreditCard size={18} />
          Acheter 10 crédits
        </>
      )}
    </button>
  );
};

export default StripePayment;
