import Link from "next/link";

import React from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import FeaturedProducts from "@/components/feature-product";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <Footer />
    </>
  );
}
