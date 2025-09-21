import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto -mb-2 z-50 w-full border-t border-gray-800 mt-10">
      <div className="max-w-5xl mx-auto px-4 py-2 pb-0 text-center text-xs text-gray-400">
        © {year} One Temp Mail
      </div>
    </footer>
  );
};

export default Footer;
