/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Contact({ property }) {
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Here you would typically send the message to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <p className='font-semibold'>
        Contact Agent about{' '}
        <span className='font-normal text-slate-700'>
          {property.address?.streetAddress}
        </span>
      </p>
      {property.price && (
        <p className='font-semibold'>
          Listed for:{' '}
          <span className='font-normal text-slate-700'>
            {formatPrice(property.price)}
          </span>
        </p>
      )}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <textarea
          name='message'
          id='message'
          rows='2'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Enter your message here...'
          className='w-full border p-3 rounded-lg'
          required
        ></textarea>

        {error && <p className='text-red-500'>{error}</p>}
        {success && (
          <p className='text-green-500'>Message sent successfully!</p>
        )}

        <button
          type='submit'
          className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
