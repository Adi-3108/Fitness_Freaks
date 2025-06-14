import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  onSuccess?: () => void;
}

export default function CheckoutForm({ clientSecret, amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      {error && <div className="error-message">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </form>
  );
} 