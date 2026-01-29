
-- Ajouter le support Stripe aux profils
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Table pour l'historique des transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_session_id text UNIQUE,
    amount_total integer,
    currency text,
    status text, -- 'pending', 'completed', 'failed'
    type text, -- 'credits', 'subscription', 'badge'
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
