import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$8.99",
    period: "per month",
    description: "Perfect for casual viewers",
    features: [
      "Watch on 1 device at a time",
      "HD quality streaming",
      "Unlimited movies and shows",
      "Cancel anytime",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "$13.99",
    period: "per month",
    description: "Great for families",
    features: [
      "Watch on 2 devices at a time",
      "Full HD quality streaming",
      "Unlimited movies and shows",
      "Download on 2 devices",
      "Cancel anytime",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$17.99",
    period: "per month",
    description: "Best viewing experience",
    features: [
      "Watch on 4 devices at a time",
      "4K + HDR quality streaming",
      "Unlimited movies and shows",
      "Download on 4 devices",
      "Early access to new releases",
      "Cancel anytime",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (<></>
    // <section className="bg-white py-20">
    //   <div className="container px-4">
    //     <div className="text-center mb-16">
    //       <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //         Choose Your Plan
    //       </h2>
    //       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    //         Select the perfect plan for your viewing needs. All plans include a 30-day free trial.
    //       </p>
    //     </div>
        
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    //       {plans.map((plan, index) => (
    //         <Card 
    //           key={index} 
    //           className={`relative ${
    //             plan.popular 
    //               ? "border-red-500 border-2 shadow-xl scale-105" 
    //               : "border-gray-200"
    //           }`}
    //         >
    //           {plan.popular && (
    //             <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600">
    //               Most Popular
    //             </Badge>
    //           )}
    //           <CardHeader className="text-center pb-8">
    //             <CardTitle className="text-2xl font-bold text-gray-900">
    //               {plan.name}
    //             </CardTitle>
    //             <CardDescription className="text-gray-600">
    //               {plan.description}
    //             </CardDescription>
    //             <div className="mt-4">
    //               <span className="text-5xl font-bold text-gray-900">
    //                 {plan.price}
    //               </span>
    //               <span className="text-gray-600 ml-2">
    //                 {plan.period}
    //               </span>
    //             </div>
    //           </CardHeader>
    //           <CardContent>
    //             <ul className="space-y-3">
    //               {plan.features.map((feature, featureIndex) => (
    //                 <li key={featureIndex} className="flex items-start gap-3">
    //                   <Check className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
    //                   <span className="text-gray-700">{feature}</span>
    //                 </li>
    //               ))}
    //             </ul>
    //           </CardContent>
    //           <CardFooter>
    //             <Button 
    //               className={`w-full ${
    //                 plan.popular 
    //                   ? "bg-red-600 hover:bg-red-700" 
    //                   : "bg-gray-900 hover:bg-gray-800"
    //               }`}
    //               size="lg"
    //             >
    //               Start Free Trial
    //             </Button>
    //           </CardFooter>
    //         </Card>
    //       ))}
    //     </div>
    //   </div>
    // </section>
  );
}
