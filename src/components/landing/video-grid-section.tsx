import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import Image from "next/image";

const videos = [
  {
    title: "Spirited Away",
    duration: "2h 5m",
    category: "Fantasy",
    rating: "PG",
    image: "/spirited-away.jpg",
  },
  {
    title: "My Neighbor Totoro",
    duration: "1h 26m",
    category: "Family",
    rating: "G",
    image: "/totoro.jpg",
  },
  {
    title: "Howl's Moving Castle",
    duration: "1h 59m",
    category: "Fantasy",
    rating: "PG",
    image: "/howls-castle.jpg",
  },
  {
    title: "Princess Mononoke",
    duration: "2h 14m",
    category: "Adventure",
    rating: "PG-13",
    image: "/mononoke.jpg",
  },
  {
    title: "Kiki's Delivery Service",
    duration: "1h 43m",
    category: "Family",
    rating: "G",
    image: "/kiki.jpg",
  },
  {
    title: "The Wind Rises",
    duration: "2h 6m",
    category: "Drama",
    rating: "PG-13",
    image: "/wind-rises.jpg",
  },
];

export function VideoGridSection() {
  return (
    <></>
    // <section className="bg-gray-50 py-20">
    //   <div className="container px-4">
    //     <div className="text-center mb-16">
    //       <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //         Popular Studio Ghibli Films
    //       </h2>
    //       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    //         Discover timeless classics and beloved favorites
    //       </p>
    //     </div>
        
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       {videos.map((video, index) => (
    //         <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow">
    //           <div className="relative aspect-video bg-gray-200">
    //             <Image
    //               src={video.image}
    //               alt={video.title}
    //               fill
    //               className="object-cover"
    //             />
    //             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
    //               <Button size="lg" className="bg-red-600 hover:bg-red-700">
    //                 <Play className="mr-2 h-5 w-5" />
    //                 Watch Now
    //               </Button>
    //             </div>
    //             <Badge className="absolute top-3 right-3 bg-red-600">
    //               {video.rating}
    //             </Badge>
    //           </div>
    //           <CardContent className="p-4">
    //             <h3 className="text-xl font-semibold text-gray-900 mb-2">
    //               {video.title}
    //             </h3>
    //             <div className="flex items-center gap-4 text-sm text-gray-600">
    //               <span className="flex items-center gap-1">
    //                 <Clock className="h-4 w-4" />
    //                 {video.duration}
    //               </span>
    //               <span>{video.category}</span>
    //             </div>
    //           </CardContent>
    //           <CardFooter className="p-4 pt-0">
    //             <Button variant="outline" className="w-full">
    //               Add to Watchlist
    //             </Button>
    //           </CardFooter>
    //         </Card>
    //       ))}
    //     </div>
    //   </div>
    // </section>
  );
}
