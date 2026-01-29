import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';
import { CreditCard, Loader2 } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Veuillez vous connecter pour acheter des crédits.");
        setLoading(false);
        return;
      }

      if (!stripe) throw new Error("Stripe n'est pas chargé.");

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: 'price_1Suvy3H9juRF89E3V3XEOrCa',
          quantity: 1,
        }],
        mode: 'payment',
        clientReferenceId: user.id, 
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/cancel',
      });

      if (error) throw error;

    } catch (err) {
      console.error("Erreur Stripe:", err);
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
          Chargement...
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
