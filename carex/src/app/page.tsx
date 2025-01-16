'use client';

import SearchBanner from './components/SearchBanner';
import OpportunityCard from './components/OpportunityCard';
import Footer from './components/Footer';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; 
import { useEffect } from 'react';
export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const userRole = localStorage.getItem("userRole");
      if (!userRole) {
        router.push("/Onboarding");
      }
    }
  }, [user, router]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="px-10">
        <SearchBanner />
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-700">Featured Opportunities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            <OpportunityCard title="Software Developer Internship" company="Tech Solutions Inc." buttonText="Learn More" />
            <OpportunityCard title="Marketing Coordinator" company="Global Brands Co." buttonText="Learn More" />
            <OpportunityCard title="Data Science Workshop" company="Data Insights Academy" buttonText="Register" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
