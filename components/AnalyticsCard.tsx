
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PartnerLink } from '../types';
import { Icon } from './Icon';

interface AnalyticsCardProps {
  link: PartnerLink;
  onSimulateActivity: (id: string) => void;
}

const StatCard: React.FC<{ icon: 'click' | 'user' | 'cart'; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon name={icon} className="w-5 h-5 text-white"/>
        </div>
        <div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-white text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
    </div>
);


export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ link, onSimulateActivity }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.generatedUrl);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const chartData = [
    { name: 'Sign Ups', value: link.conversions.signUp, fill: '#38bdf8' },
    { name: 'Purchases', value: link.conversions.purchase, fill: '#818cf8' },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl shadow-slate-950/30 overflow-hidden animate-fade-in">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
            <div>
                <h3 className="text-xl font-bold text-white">{link.partnerName}</h3>
                <p className="text-sm text-sky-400 font-mono bg-sky-900/50 inline-block px-2 py-1 rounded-md mt-1">
                    {link.promoCode}
                </p>
                 <p className="text-xs text-slate-500 mt-2">
                    Created: {new Date(link.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className="flex-shrink-0">
                 <button onClick={() => onSimulateActivity(link.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                    Simulate Activity
                </button>
            </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between gap-4 mb-6">
          <Icon name="link" className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            readOnly
            value={link.generatedUrl}
            className="bg-transparent text-slate-300 w-full text-sm font-mono focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 text-sm font-semibold py-1 px-3 rounded-md transition-all duration-200 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {copied ? <Icon name="check" className="w-4 h-4"/> : <Icon name="clipboard" className="w-4 h-4"/>}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon="click" label="Total Clicks" value={link.clicks} color="bg-sky-500/80"/>
            <StatCard icon="user" label="Sign Ups" value={link.conversions.signUp} color="bg-blue-500/80"/>
            <StatCard icon="cart" label="Purchases" value={link.conversions.purchase} color="bg-indigo-500/80"/>
        </div>
        
        <div>
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Icon name="chart" className="w-5 h-5 mr-2 text-slate-400" />
                Conversion Funnel
            </h4>
            <div className="h-64 w-full bg-slate-900/20 p-2 rounded-lg">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                color: '#f1f5f9'
                            }}
                            cursor={{fill: '#334155'}}
                        />
                        <Bar dataKey="value" barSize={40} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
};
