import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';

// 1. Initialisation de Supabase (Vérifie que tes variables d'environnement sont bien configurées dans Vercel)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 2. Initialisation de Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // 3. Récupérer l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Veuillez vous connecter pour acheter des crédits.");
        setLoading(false);
        return;
      }

      if (!stripe) throw new Error("Stripe n'est pas chargé.");

      // 4. Redirection vers la page de paiement Stripe
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: 'price_1Suvy3H9juRF89E3V3XEOrCa', // Ton ID de prix
          quantity: 1,
        }],
        mode: 'payment',
        // On passe l'ID de l'utilisateur pour que Supabase sache qui créditer plus tard
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

  return
