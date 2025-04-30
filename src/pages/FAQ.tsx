
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      category: "Smart Board",
      questions: [
        {
          id: 1,
          question: "How do I connect my Smart Board to the app?",
          answer: "To connect your Smart Board, go to the dashboard and click on 'Pair Board'. You can then either scan the QR code on the back of your board or enter the unique ID manually."
        },
        {
          id: 2,
          question: "What is the battery life of the Smart Board?",
          answer: "The Smart Board has a battery life of approximately 20+ hours of active play. It takes about 3 hours to fully charge from empty."
        },
        {
          id: 3,
          question: "Can I play without an internet connection?",
          answer: "Yes, the Smart Board can be used in offline mode for local play. However, to sync with the app, record games, or play online, an internet connection is required."
        },
        {
          id: 4,
          question: "How do I update the firmware on my Smart Board?",
          answer: "Firmware updates are done automatically when the board is connected to the app. You'll receive a notification when updates are available."
        }
      ]
    },
    {
      category: "Membership & Billing",
      questions: [
        {
          id: 5,
          question: "What are the benefits of a premium membership?",
          answer: "Premium members get access to all courses, unlimited puzzle solving, advanced analysis tools, and priority pairing with their Smart Board."
        },
        {
          id: 6,
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription at any time from your account settings page. Your membership will remain active until the end of the current billing cycle."
        },
        {
          id: 7,
          question: "Do you offer refunds?",
          answer: "We offer a 30-day money-back guarantee on Smart Board purchases and a 7-day refund policy on digital subscriptions."
        }
      ]
    },
    {
      category: "Playing & Training",
      questions: [
        {
          id: 8,
          question: "How is my rating calculated?",
          answer: "Your rating is calculated using a modified Elo system that takes into account your performance against opponents of different skill levels."
        },
        {
          id: 9,
          question: "Can I play against the AI?",
          answer: "Yes, our platform features multiple AI opponents ranging from beginner to grandmaster level. You can adjust the difficulty to match your skill level."
        },
        {
          id: 10,
          question: "How do tournaments work?",
          answer: "Tournaments are scheduled events where players compete against each other. You can join open tournaments or create private ones for friends. Various formats are available, including Swiss, Round Robin, and Arena."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          id: 11,
          question: "The app is not recognizing my Smart Board, what should I do?",
          answer: "First, ensure your board is charged and Bluetooth is enabled on your device. Try restarting both the board and the app. If issues persist, check for firmware updates or contact our support team."
        },
        {
          id: 12,
          question: "I'm experiencing lag during online games, how can I fix this?",
          answer: "Lag can be caused by poor internet connection. Try switching to a more stable WiFi network or move closer to your router. You can also try lowering the graphics settings in the app."
        }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState(faqs[0].category);
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (id: number) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter(qId => qId !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <HelpCircle className="h-8 w-8 text-chess-accent mr-4" />
            <h1 className="text-4xl font-bold text-chess-text-light">Frequently Asked Questions</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-chess-beige-100 rounded-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-chess-text-dark mb-4">Categories</h3>
                <nav>
                  <ul className="space-y-2">
                    {faqs.map(category => (
                      <li key={category.category}>
                        <button
                          onClick={() => setActiveCategory(category.category)}
                          className={`w-full text-left py-2 px-4 rounded-md transition-colors ${
                            activeCategory === category.category
                              ? 'bg-chess-accent text-chess-text-light'
                              : 'bg-chess-beige-300 text-chess-text-dark hover:bg-chess-accent/30'
                          }`}
                        >
                          {category.category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="mt-8 p-4 bg-chess-beige-300 rounded-lg">
                  <h4 className="font-bold text-chess-text-dark mb-2">Need more help?</h4>
                  <p className="text-gray-700 text-sm mb-4">
                    Contact our support team for assistance with any issues not covered in our FAQ.
                  </p>
                  <button className="w-full bg-chess-accent text-chess-text-light py-2 rounded-md hover:bg-opacity-90 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/4">
              {faqs.filter(category => category.category === activeCategory).map(category => (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold text-chess-text-light mb-6">{category.category} FAQ</h2>
                  <div className="space-y-4">
                    {category.questions.map(faq => (
                      <div key={faq.id} className="bg-chess-beige-100 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(faq.id)}
                          className="w-full text-left p-6 flex justify-between items-center"
                        >
                          <span className="font-bold text-chess-text-dark">{faq.question}</span>
                          <span className="text-chess-accent">
                            {openQuestions.includes(faq.id) ? '−' : '+'}
                          </span>
                        </button>
                        {openQuestions.includes(faq.id) && (
                          <div className="px-6 pb-6 -mt-2">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
