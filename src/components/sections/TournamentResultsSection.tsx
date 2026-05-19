"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/common/SectionWrapper";
import { TournamentResultCard } from "@/components/cards/TournamentResultCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TournamentResult {
  category: string;
  results: Array<{
    position: 1 | 2 | 3;
    playerName: string;
    score?: string;
  }>;
}

// Gallery images from public/images/recent-event folder
const galleryImages = [
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.34 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.35 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.36 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.37 PM (1).jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.37 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.39 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.43.40 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.38 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.39 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.43 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.44 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.45 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.47 PM.jpeg",
  "/images/recent-event/WhatsApp Image 2026-05-17 at 4.44.48 PM.jpeg",
];

const tournamentData: TournamentResult[] = [
  {
    category: "Under-9 Boys/Girls",
    results: [
      { position: 1, playerName: "Yatharth" },
      { position: 2, playerName: "Angadeep Singh" },
      { position: 3, playerName: "Shanaya" },
    ],
  },
  {
    category: "Under-11 Girls",
    results: [
      { position: 1, playerName: "Priyanshi" },
      { position: 2, playerName: "Avni Gupta" },
      { position: 3, playerName: "Tisha Walia" },
    ],
  },
  {
    category: "Under-11 Boys",
    results: [
      { position: 1, playerName: "Rayaan" },
      { position: 2, playerName: "Hetaksh Goyal" },
      { position: 3, playerName: "Krishna" },
    ],
  },
  {
    category: "Under-13 Girls",
    results: [
      { position: 1, playerName: "Gauranshi Uppal" },
      { position: 2, playerName: "Avni Gupta" },
      { position: 3, playerName: "Mihika Mahajan" },
    ],
  },
  {
    category: "Under-13 Boys",
    results: [
      { position: 1, playerName: "Mehul" },
      { position: 2, playerName: "Divit Bansal" },
      { position: 3, playerName: "Nandan" },
    ],
  },
  {
    category: "Under-15 Girls",
    results: [
      { position: 1, playerName: "Sherell" },
      { position: 2, playerName: "Gauranshi Uppal" },
      { position: 3, playerName: "Sameeksha Negi" },
    ],
  },
  {
    category: "Under-15 Boys",
    results: [
      { position: 1, playerName: "Parth Malhotra" },
      { position: 2, playerName: "Sanchit" },
      { position: 3, playerName: "Abhijit Singh" },
    ],
  },
  {
    category: "Under-17 Girls",
    results: [
      { position: 1, playerName: "Sherrel" },
      { position: 2, playerName: "Gauranshi Uppal" },
      { position: 3, playerName: "Manya" },
    ],
  },
  {
    category: "Under-17 Boys",
    results: [
      { position: 1, playerName: "Saksham Ahuja" },
      { position: 2, playerName: "Abhijeet Singh" },
      { position: 3, playerName: "Parth Malhotra" },
    ],
  },
  {
    category: "Under-19 Girls",
    results: [
      { position: 1, playerName: "Cherrish" },
      { position: 2, playerName: "Sherrel" },
      { position: 3, playerName: "Manya" },
    ],
  },
  {
    category: "Under-19 Boys",
    results: [
      { position: 1, playerName: "Bhavya Yadav" },
      { position: 2, playerName: "Vardaan" },
      { position: 3, playerName: "Aarush" },
    ],
  },
  {
    category: "Women's Single",
    results: [
      { position: 1, playerName: "Sherrel" },
      { position: 2, playerName: "Cherrish" },
      { position: 3, playerName: "Rani" },
    ],
  },
  {
    category: "Men's Single",
    results: [
      { position: 1, playerName: "Bhavya Yadav" },
      { position: 2, playerName: "Vikas Guleria" },
      { position: 3, playerName: "Bobby Mehta" },
    ],
  },
  {
    category: "Men's Doubles",
    results: [
      { position: 1, playerName: "Bobby Mehta/Samarth" },
      { position: 2, playerName: "Vikas/Mayank" },
      { position: 3, playerName: "Bhavya/Nilesh" },
    ],
  },
  {
    category: "Age 39+",
    results: [
      { position: 1, playerName: "Alkesh Saini" },
      { position: 2, playerName: "Bhupinder Singh" },
      { position: 3, playerName: "M A Khan" },
    ],
  },
  {
    category: "Age 49+",
    results: [
      { position: 1, playerName: "Bobby Mehta" },
      { position: 2, playerName: "Bhupinder Verma" },
      { position: 3, playerName: "Alkesh Saini" },
    ],
  },
  {
    category: "Age 55+",
    results: [
      { position: 1, playerName: "Mukesh Mishra" },
      { position: 2, playerName: "Dr. Satish Gupta" },
      { position: 3, playerName: "J Bhandari" },
    ],
  },
  {
    category: "Age 59+",
    results: [
      { position: 1, playerName: "J Bhandari" },
      { position: 2, playerName: "Mukesh Mishra" },
      { position: 3, playerName: "N K Banga" },
    ],
  },
  {
    category: "Veterans Doubles",
    results: [
      { position: 1, playerName: "Bhupinder/Alkesh" },
      { position: 2, playerName: "Rohit/Heshwinder" },
      { position: 3, playerName: "Vijay/Satish Kumar Gupta" },
    ],
  },
];

export function TournamentResultsSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    tournamentData[0].category
  );
  const [viewMode, setViewMode] = useState<"results" | "gallery">("results");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(
      expandedCategory === category ? null : category
    );
  };

  return (
    <SectionWrapper
      id="tournament-results"
      title="Tournament Results"
      className="bg-linear-to-b from-white via-[#F4F6F8] to-white"
    >
      {/* Recent Event Heading */}
      <div className="mb-12">
        <div className="inline-block">
          <span className="text-sm font-bold text-[#C62828] uppercase tracking-widest px-4 py-1 bg-red-100 rounded-full">
            🏆 Recent Event
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mt-4 mb-2">
          1st Challenger Table Tennis Tournament
        </h2>
        <p className="text-gray-600">
          Chandigarh - 29-30 November 2025 | Results & Winners
        </p>
      </div>
      {/* Tournament Info Card */}
      <div className="mb-12 bg-linear-to-r from-[#C62828] to-[#B71C1C] rounded-xl p-6 md:p-8 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-red-100 uppercase tracking-wide">
              Tournament
            </p>
            <p className="text-lg md:text-xl font-bold mt-1">1st Challenger</p>
            <p className="text-sm text-red-100 mt-1">Table Tennis</p>
          </div>
          <div>
            <p className="text-sm font-medium text-red-100 uppercase tracking-wide">
              Location
            </p>
            <p className="text-lg md:text-xl font-bold mt-1">Chandigarh</p>
            <p className="text-sm text-red-100 mt-1">19 Categories</p>
          </div>
          <div>
            <p className="text-sm font-medium text-red-100 uppercase tracking-wide">
              Date
            </p>
            <p className="text-lg md:text-xl font-bold mt-1">29-30 Nov</p>
            <p className="text-sm text-red-100 mt-1">2025</p>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => setViewMode("results")}
          className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            viewMode === "results"
              ? "bg-[#C62828] text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          📊 Results & Winners
        </button>
        <button
          onClick={() => setViewMode("gallery")}
          className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            viewMode === "gallery"
              ? "bg-[#C62828] text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🖼️ Gallery
        </button>
      </div>

      {/* Results View - Enhanced */}
      {viewMode === "results" && (
        <div>
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-[#C62828]">19</p>
              <p className="text-sm text-gray-600 mt-2 font-semibold">Categories</p>
              <p className="text-xs text-gray-500 mt-1">Youth & Adult</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-[#C62828]">57</p>
              <p className="text-sm text-gray-600 mt-2 font-semibold">Winners</p>
              <p className="text-xs text-gray-500 mt-1">Gold Medalists</p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-[#C62828]">300</p>
              <p className="text-sm text-gray-600 mt-2 font-semibold">Participants</p>
              <p className="text-xs text-gray-500 mt-1">From Chandigarh</p>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <p className="text-3xl font-bold text-[#C62828]">2</p>
              <p className="text-sm text-gray-600 mt-2 font-semibold">Days</p>
              <p className="text-xs text-gray-500 mt-1">Nov 29-30</p>
            </div>
          </div>

          {/* Results Categories - Enhanced Layout */}
          <div className="space-y-3">
            {tournamentData.map((category) => (
              <div
                key={category.category}
                className="border-l-4 border-[#C62828] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full bg-linear-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 px-6 py-4 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-[#C62828] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-[#0B1C2D]">
                      {category.category}
                    </h3>
                    <span className="text-xs bg-[#C62828]/10 text-[#C62828] px-2 py-1 rounded-full font-bold">
                      {category.results.length} Winners
                    </span>
                  </div>
                  <span
                    className={`transform transition-transform ${
                      expandedCategory === category.category ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-[#C62828]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </span>
                </button>

                {/* Category Results - Expandable */}
                {expandedCategory === category.category && (
                  <div className="p-6 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {category.results.map((result, idx) => (
                        <TournamentResultCard
                          key={`${category.category}-${idx}`}
                          category={category.category}
                          position={result.position}
                          playerName={result.playerName}
                          score={result.score}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery View - Professional Grid */}
      {viewMode === "gallery" && (
        <div>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#0B1C2D] mb-2">
              Tournament Moments & Highlights
            </h3>
            <p className="text-gray-600 mb-8">
              Experience the action and celebration from the 1st Challenger Table Tennis Tournament
            </p>

            {/* Masonry Grid Layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryImages.map((image, idx) => (
                <div
                  key={idx}
                  className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 break-inside-avoid"
                  onClick={() => setSelectedImage(image)}
                >
                  {/* Image Container */}
                  <div className="relative bg-gray-200 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`Tournament Image ${idx + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <p className="text-sm font-semibold">View</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Counter */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Total Photos: <span className="font-bold text-[#C62828]">{galleryImages.length}</span> | 
              Moments captured from the tournament
            </p>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Gallery */}
      {selectedImage && viewMode === "gallery" && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Tournament"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
