
import React, { useState } from 'react';
import { PartnerLink } from '../types';
import { Icon } from './Icon';

interface LinkGeneratorProps {
  onLinkGenerated: (link: PartnerLink) => void;
}

export const LinkGenerator: React.FC<LinkGeneratorProps> = ({ onLinkGenerated }) => {
  const [partnerName, setPartnerName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !promoCode.trim()) {
      setError('Both fields are required.');
      return;
    }
    setError('');

    const newLink: PartnerLink = {
      id: crypto.randomUUID(),
      partnerName: partnerName.trim(),
      promoCode: promoCode.trim().toUpperCase(),
      generatedUrl: `https://example.com/join?partner_id=${crypto.randomUUID().slice(0, 8)}&promo=${promoCode.trim().toUpperCase()}`,
      createdAt: new Date().toISOString(),
      clicks: 0,
      conversions: {
        signUp: 0,
        purchase: 0,
      },
    };

    onLinkGenerated(newLink);
    setPartnerName('');
    setPromoCode('');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 shadow-2xl shadow-slate-950/30">
      <h2 className="text-2xl font-bold text-white mb-1">Generate Partner Link</h2>
      <p className="text-slate-400 mb-6">Create a new trackable link for a partner.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="partnerName" className="block text-sm font-medium text-slate-300 mb-2">
            Partner Name
          </label>
          <input
            id="partnerName"
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="e.g., Affiliate Inc."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="promoCode" className="block text-sm font-medium text-slate-300 mb-2">
            Promotional Code
          </label>
          <input
            id="promoCode"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="e.g., SAVE20"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
        >
          <Icon name="plus" className="w-5 h-5 mr-2" />
          Create Link
        </button>
      </form>
    </div>
  );
};
