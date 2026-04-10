"use client";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";

export default function Home() {
  return (
    <main className="flex items-center flex-col bg-indigo-950 min-h-screen justify-between gap-15">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
