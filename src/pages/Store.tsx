
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ShoppingCartComponent from '@/components/store/ShoppingCart';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Store = () => {
  const { addToCart } = useCart();

  const products = [
    {
      id: "smart-board-1",
      name: "Smart Chess Board",
      description: "Experience chess like never before with our innovative smart board.",
      price: 299.99,
      image: "Smart Board Image",
      link: "/smart-board"
    },
    {
      id: "accessories-1",
      name: "Chess Accessories",
      description: "Enhance your chess experience with our premium accessories.",
      price: 49.99,
      image: "Accessories Image",
      link: "/store/accessories"
    },
    {
      id: "gift-card-1",
      name: "Gift Cards",
      description: "The perfect gift for the chess enthusiast in your life.",
      price: 50.00,
      image: "Gift Card Image",
      link: "/store/gift-cards"
    }
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-chess-text-light">Store</h1>
        <ShoppingCartComponent />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg hover-lift card-hover border border-transparent">
            <div className="h-60 bg-chess-accent/20 flex items-center justify-center">
              <span className="text-chess-text-dark text-lg">{product.image}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-chess-text-dark mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-chess-text-dark">${product.price}</span>
                <div className="space-x-2">
                  <Link to={product.link}>
                    <Button variant="secondary" className="mr-2">
                      Details
                    </Button>
                  </Link>
                  <Button onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-chess-beige-300 rounded-lg p-8 hover-grow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-chess-text-dark mb-4">Limited Time Offer</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Get a free set of premium chess pieces when you purchase the Smart Chess Board. Limited time offer while supplies last.
          </p>
          <Button 
            size="lg" 
            className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => handleAddToCart(products[0])}
          >
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Store;
