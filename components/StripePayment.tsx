import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// On récupère votre clé publique depuis les variables Vercel
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment: React.FC = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    // Note : Pour un vrai paiement, il faudrait normalement passer par une API 
    // pour créer une "Session". Voici la méthode simplifiée :
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: 'id_de_votre_prix_stripe', // À récupérer sur votre dashboard Stripe
          quantity: 1,
        }],
        mode: 'payment',
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/cancel',
      });

      if (error) console.error("Stripe error:", error);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
    >
      Acheter des crédits
    </button>
  );
};

export default StripePayment;
