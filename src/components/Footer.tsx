import React from 'react';
import { FaLaptopCode } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-black px-6 py-3 rounded-xl shadow-lg z-50">
      <div className="group flex items-center justify-center space-x-2 text-sm font-light">
        <span className="animate-bounce group-hover:animate-none hover:cursor-pointer text-purple-700 duration-300">
          <FaLaptopCode />
        </span>
        <p>
          Coded with care by{' '}
          <a
            href="https://mugeshkannan.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-800 hover:text-purple-400 transition-all duration-200 underline underline-offset-4"
          >
            Mugesh Kannan
          </a>{' '}
          • {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
