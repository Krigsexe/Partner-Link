
import React from 'react';
import { PartnerLink } from '../types';
import { AnalyticsCard } from './AnalyticsCard';

interface DashboardProps {
  links: PartnerLink[];
  onSimulateActivity: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ links, onSimulateActivity }) => {
  const sortedLinks = [...links].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-8">
      {sortedLinks.length > 0 ? (
        <div className="space-y-6">
          {sortedLinks.map((link) => (
            <AnalyticsCard key={link.id} link={link} onSimulateActivity={onSimulateActivity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl">
          <h3 className="text-xl font-semibold text-white">No links yet!</h3>
          <p className="text-slate-400 mt-2">Use the form above to generate your first partner link.</p>
        </div>
      )}
    </div>
  );
};
