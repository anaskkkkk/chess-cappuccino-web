
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <ShieldCheck className="h-8 w-8 text-chess-accent mr-4" />
            <h1 className="text-4xl font-bold text-chess-text-light">Terms of Service</h1>
          </div>
          
          <div className="bg-chess-beige-100 rounded-lg p-8 shadow-lg">
            <div className="prose prose-headings:text-chess-text-dark prose-p:text-gray-700 max-w-none">
              <p className="text-gray-700">Last Updated: April 30, 2025</p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the SmartChess website, mobile application, and Smart Chess Board products (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use our Services.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">2. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of our Services after the changes take effect constitutes your acceptance of the revised Terms.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">3. Account Registration and Security</h2>
              <p>
                To use certain features of our Services, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We cannot and will not be liable for any loss or damage arising from your failure to maintain the security of your account.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">4. Smart Chess Board Products</h2>
              <h3 className="text-xl font-bold text-chess-text-dark mt-6 mb-3">4.1 Warranty</h3>
              <p>
                Our Smart Chess Board products come with a limited warranty as described in our Warranty Policy. Except for the express warranties provided, our products are provided "as is" without any warranties of any kind.
              </p>
              
              <h3 className="text-xl font-bold text-chess-text-dark mt-6 mb-3">4.2 Return Policy</h3>
              <p>
                Our products may be returned in accordance with our Return Policy, which is incorporated by reference into these Terms.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">5. Subscription Services</h2>
              <p>
                We offer subscription-based access to certain features of our Services. By subscribing, you agree to the following terms:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Subscription fees will be billed in advance on a recurring basis</li>
                <li>Subscriptions automatically renew until canceled</li>
                <li>You may cancel your subscription at any time from your account settings</li>
                <li>No refunds will be provided for any unused portion of a subscription period</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">6. Prohibited Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Use the Services in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from fully enjoying the Services</li>
                <li>Use the Services to transmit any malware, viruses, or other harmful code</li>
                <li>Attempt to circumvent any security or access restrictions of the Services</li>
                <li>Use automated means or interfaces not provided by us to access the Services</li>
                <li>Use the Services to cheat in chess games or competitions</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest any information from our Services</li>
                <li>Violate any applicable law or regulation</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">7. Intellectual Property Rights</h2>
              <p>
                The Services and their contents, features, and functionality are owned by SmartChess and are protected by copyright, trademark, patent, and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works based upon our Services without our express permission.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">8. User Content</h2>
              <p>
                You retain ownership of any content you submit to the Services ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, create derivative works based on, distribute, and display your User Content in connection with operating and providing the Services.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your access to the Services at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Services will immediately cease.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">10. Disclaimer of Warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">11. Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL SMARTCHESS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE USE OF OR INABILITY TO USE THE SERVICES.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms and your use of the Services shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any choice or conflict of law provision or rule.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">13. Dispute Resolution</h2>
              <p>
                Any dispute arising from these Terms or your use of the Services shall be resolved through binding arbitration conducted by the American Arbitration Association in San Francisco, California.
              </p>
              
              <h2 className="text-2xl font-bold text-chess-text-dark mt-8 mb-4">14. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: legal@smartchess.com<br />
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

export default TermsOfService;
