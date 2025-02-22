import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F1EA]/30">
      <div className="bg-white p-8 rounded-[7px] shadow-md border-2 border-[#E8E8E8] max-w-md w-full mx-4">
        <h1 className="text-2xl font-medium text-gray-900 mb-6 font-instrument-sans">Contact Us</h1>
        <p className="text-[13px] text-gray-700 mb-4 font-instrument-sans">
          Feel free to reach out to us at:
        </p>
        <a 
          href="mailto:kew@edbn.me" 
          className="inline-block text-[13px] font-medium bg-black text-white px-[13px] pt-[8px] pb-[8px] rounded-[7px] hover:bg-gray-800 transition-colors font-instrument-sans"
        >
          kew@edbn.me
        </a>
      </div>
    </div>
  );
}
