
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Gift, Mail, MessageSquare, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const amounts = [25, 50, 100, 200];
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!email) {
      toast.error('Please enter a recipient email address');
      return;
    }
    
    toast.success('Gift card added to cart!');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-chess-text-light mb-4">Gift Cards</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The perfect gift for the chess enthusiast in your life. Our gift cards can be used for Smart Boards, accessories, or premium memberships.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg hover-lift">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 flex items-center justify-center bg-chess-beige-300">
              <div className="text-center">
                <Gift size={60} className="mx-auto mb-4 text-chess-accent" />
                <div className="text-chess-text-dark text-3xl font-bold mb-2">SmartChess</div>
                <div className="text-gray-700 text-xl mb-4">Gift Card</div>
                <div className="text-chess-text-dark text-4xl font-bold">${selectedAmount}</div>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold text-chess-text-dark mb-6">Customize Your Gift</h3>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Select Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  {amounts.map(amount => (
                    <button
                      key={amount}
                      className={`py-3 px-4 border ${
                        selectedAmount === amount
                          ? 'border-chess-accent bg-chess-accent/10 text-chess-text-dark'
                          : 'border-gray-300 text-gray-700 hover:border-chess-accent hover:bg-chess-accent/5'
                      } rounded-md transition-colors`}
                      onClick={() => setSelectedAmount(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Recipient Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-chess-accent bg-white"
                  placeholder="Enter recipient's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Personal Message (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-chess-accent bg-white"
                  placeholder="Add a personal message..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              
              <Button className="w-full bg-chess-accent text-chess-text-light py-3 text-lg hover:bg-opacity-90" onClick={handleSubmit}>
                <ShoppingCart className="mr-1 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-chess-text-light mb-6">Gift Card FAQ</h3>
          
          <div className="space-y-6">
            <div className="bg-chess-beige-100 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-chess-text-dark mb-2">How do gift cards work?</h4>
              <p className="text-gray-700">
                Our digital gift cards are delivered via email to your recipient. They contain a unique code that can be redeemed during checkout on our website.
              </p>
            </div>
            
            <div className="bg-chess-beige-100 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-chess-text-dark mb-2">When will the gift card be delivered?</h4>
              <p className="text-gray-700">
                You can choose immediate delivery or schedule it for a future date during the checkout process.
              </p>
            </div>
            
            <div className="bg-chess-beige-100 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-bold text-chess-text-dark mb-2">Do gift cards expire?</h4>
              <p className="text-gray-700">
                No, our gift cards never expire and have no additional fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GiftCards;
