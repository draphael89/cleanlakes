import LakesList from '@/app/components/LakesList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Clean Lakes | cleanlakes.ai',
  description: 'Discover and explore clean lakes across the United States. Get up-to-date information on water quality, weather conditions, and biodiversity.',
  openGraph: {
    title: 'Explore Clean Lakes | cleanlakes.ai',
    description: 'Discover and explore clean lakes across the United States. Get up-to-date information on water quality, weather conditions, and biodiversity.',
    type: 'website',
    url: 'https://cleanlakes.ai/lakes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Clean Lakes | cleanlakes.ai',
    description: 'Discover and explore clean lakes across the United States. Get up-to-date information on water quality, weather conditions, and biodiversity.',
  },
};

export default function LakesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
          Explore Clean Lakes
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Discover beautiful, clean lakes across the United States. Get real-time data on water quality, weather conditions, and local ecosystems.
        </p>
        <LakesList />
      </div>
    </main>
  );
}