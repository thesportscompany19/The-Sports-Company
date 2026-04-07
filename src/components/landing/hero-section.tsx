import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-black via-red-950/20 to-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>
      
      <div className="container relative z-10 px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Welcome to the Studio Ghibli's
            <br />
            <span className="text-red-500">Streaming Service</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-gray-300 sm:text-xl">
            Watch all your favorite Studio Ghibli films and exclusive content in one place
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
