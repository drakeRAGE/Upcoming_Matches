import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm p-6 text-center text-gray-400 text-sm mt-12">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} Sports<span className="text-blue-400">Orca</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;