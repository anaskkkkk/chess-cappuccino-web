
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <FileText className="h-8 w-8 text-chess-accent mr-4" />
            <h1 className="text-4xl font-bold text-chess-text-light">Privacy Policy</h1>
          </div>
          
          <div className="bg-chess-beige-100 rounded-lg p-8 shadow-lg">
            <div className="prose prose-headings:text-chess-text-dark prose-p:text-gray-700 max-w-none">
              <p className="text-gray-700">Last Updated: April 30, 2025</p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">1. Introduction</h2>
              <p>
                SmartChess ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and Smart Chess Board products (collectively, the "Services").
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-bold text-chess-text-dark mt-6 mb-3">2.1 Personal Information</h3>
              <p>
                We may collect personal information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Name, email address, and password when you create an account</li>
                <li>Billing and payment information when you purchase products or services</li>
                <li>Profile information such as your username, profile picture, and chess rating</li>
                <li>Communication preferences and settings</li>
                <li>Information you provide when contacting our support team</li>
              </ul>
              
              <h3 className="text-xl font-bold text-chess-text-dark mt-6 mb-3">2.2 Usage Information</h3>
              <p>
                When you use our Services, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Chess games you play, including moves, timing, and results</li>
                <li>Puzzles completed and performance metrics</li>
                <li>Courses viewed and progress made</li>
                <li>Device information (e.g., device model, operating system, browser type)</li>
                <li>IP address and geographic location</li>
                <li>Smart Board usage data and interactions</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information, such as updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience and deliver content relevant to your interests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Improve our marketing and promotional efforts</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">4. Sharing of Information</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>With third-party service providers who perform services on our behalf</li>
                <li>With other users as part of the normal operation of our Services (e.g., leaderboards, game history)</li>
                <li>With your consent or at your direction</li>
                <li>In response to a request for information if we believe disclosure is in accordance with applicable law</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies</li>
                <li>In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
              </ul>

              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">5. Your Choices</h2>
              <p>
                You can update your account information and preferences at any time by logging into your account settings. You may also opt-out of receiving promotional emails by following the instructions in those emails.
              </p>

              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">6. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
              </p>

              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">7. Children's Privacy</h2>
              <p>
                Our Services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through a notice on our website prior to the change becoming effective.
              </p>

              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@smartchess.com<br />
                Address: 123 Chess Street, Suite 456, San Francisco, CA 94107
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
