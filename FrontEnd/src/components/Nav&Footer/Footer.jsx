import React from 'react';
import { MdEmail, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Sezione Contact Me */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Contact Me</h4>
            <div className="flex flex-col space-y-2">
              <a href="mailto:abdulmoha@outlook.it" className="flex items-center justify-center hover:text-blue-500 transition-colors">
                <MdEmail className="mr-2" />
                abdulmoha@outlook.it
              </a>
              <a href="tel:+393455085467" className="flex items-center justify-center hover:text-blue-500 transition-colors">
                <MdPhone className="mr-2" />
                +39 345 508 5467
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 text-sm text-gray-400">
            © {new Date().getFullYear()} Abd Elrahman Mohamed. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;