
import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PartnerLink } from './types';
import { LinkGenerator } from './components/LinkGenerator';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [links, setLinks] = useLocalStorage<PartnerLink[]>('partnerLinks', []);

  const handleLinkGenerated = (newLink: PartnerLink) => {
    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  const handleSimulateActivity = (id: string) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (link.id === id) {
          const newClicks = link.clicks + Math.floor(Math.random() * 20) + 5;
          const newSignUps = link.conversions.signUp + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0);
          const newPurchases = newSignUps > link.conversions.signUp && Math.random() > 0.6 ? link.conversions.purchase + Math.floor(Math.random() * 2) + 1 : link.conversions.purchase;

          return {
            ...link,
            clicks: newClicks,
            conversions: {
              signUp: newSignUps,
              purchase: newPurchases,
            },
          };
        }
        return link;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-400 opacity-20 blur-[100px]"></div>
      </div>
      <header className="py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
          Partner Link Dashboard
        </h1>
        <p className="mt-2 text-slate-400">Generate, Track, and Analyze your Partner Links</p>
      </header>
      <main className="container mx-auto max-w-4xl p-4 md:p-6">
        <LinkGenerator onLinkGenerated={handleLinkGenerated} />
        <Dashboard links={links} onSimulateActivity={handleSimulateActivity} />
      </main>
      <footer className="text-center py-6 text-sm text-slate-600">
        <p>&copy; {new Date().getFullYear()} Partner Tracker Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
