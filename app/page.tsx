'use client';

import React from 'react';
import { Element } from 'react-scroll';
import dynamic from 'next/dynamic';
import Layout from './components/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

const WaterBackground = dynamic(() => import('./components/WaterBackground'), { ssr: false });
const HeroSection = dynamic(() => import('./components/HeroSection'));
const AboutSection = dynamic(() => import('./components/AboutSection'));
const FeaturesSection = dynamic(() => import('./components/FeaturesSection'));
const CallToActionSection = dynamic(() => import('./components/CallToActionSection'));

export default function Home() {
  return (
    <Layout>
      <WaterBackground />
      <Header />
      <main className="relative z-10 pt-24">
        <Element name="home" className="pt-16">
          <HeroSection />
        </Element>
        <Element name="features" className="pt-16">
          <FeaturesSection />
        </Element>
        <Element name="about" className="pt-16">
          <AboutSection />
        </Element>
        <Element name="cta" className="pt-16">
          <CallToActionSection />
        </Element>
      </main>
      <Footer />
      <ScrollToTopButton />
    </Layout>
  );
}