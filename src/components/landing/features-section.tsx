import { Card, CardContent } from "@/components/ui/card";
import { Download, Tv, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "Watch on Any Device",
    description: "Stream on your TV, laptop, phone, and tablet",
  },
  {
    icon: Download,
    title: "Download & Watch",
    description: "Save your favorites and watch offline anytime",
  },
  {
    icon: Users,
    title: "Family Friendly",
    description: "Create profiles for kids with age-appropriate content",
  },
  {
    icon: Sparkles,
    title: "HD & 4K Quality",
    description: "Experience Studio Ghibli in stunning high definition",
  },
];

export function FeaturesSection() {
  return (<></>
    // <section className="bg-white py-20">
    //   <div className="container px-4">
    //     <div className="text-center mb-16">
    //       <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //         Why Choose Our Service?
    //       </h2>
    //       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    //         Experience the magic of Studio Ghibli with premium features designed for the best viewing experience
    //       </p>
    //     </div>
        
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //       {features.map((feature, index) => (
    //         <Card key={index} className="border-2 hover:border-red-500 transition-colors">
    //           <CardContent className="p-6 text-center space-y-4">
    //             <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
    //               <feature.icon className="h-8 w-8 text-red-600" />
    //             </div>
    //             <h3 className="text-xl font-semibold text-gray-900">
    //               {feature.title}
    //             </h3>
    //             <p className="text-gray-600">
    //               {feature.description}
    //             </p>
    //           </CardContent>
    //         </Card>
    //       ))}
    //     </div>
    //   </div>
    // </section>
  );
}
