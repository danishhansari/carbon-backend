import Link from "next/link";

import React from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import FeaturedProducts from "@/components/feature-product";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <nav className="flex items-center text-2xl gap-4 justify-center mt-8">
        <h1>Hi there</h1>

        <Link href={"/upload"} scroll={false} className="text-blue-400">
          Upload route
        </Link>
      </nav>
    </>
  );
}
