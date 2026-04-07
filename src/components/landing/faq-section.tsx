import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Studio Ghibli Streaming?",
    answer: "Studio Ghibli Streaming is a dedicated streaming service that offers the complete collection of Studio Ghibli films and exclusive behind-the-scenes content. Watch your favorite classics and discover new releases in stunning quality.",
  },
  {
    question: "How much does it cost?",
    answer: "We offer three plans: Basic ($8.99/month), Standard ($13.99/month), and Premium ($17.99/month). All plans include a 30-day free trial, and you can cancel anytime without any commitment.",
  },
  {
    question: "Can I download movies to watch offline?",
    answer: "Yes! Standard and Premium plans allow you to download movies and watch them offline on your devices. Basic plan supports streaming only.",
  },
  {
    question: "What devices can I watch on?",
    answer: "You can watch on smart TVs, streaming devices, game consoles, smartphones, tablets, and computers. Our service is compatible with iOS, Android, Windows, macOS, and most smart TV platforms.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All new subscribers get a 30-day free trial. You can cancel anytime during the trial period without being charged.",
  },
  {
    question: "Can I share my account with family?",
    answer: "Yes! You can create multiple profiles under one account. The number of simultaneous streams depends on your plan: Basic (1), Standard (2), or Premium (4).",
  },
];

export function FAQSection() {
  return (<></>
    // <section className="bg-gray-50 py-20">
    //   <div className="container px-4">
    //     <div className="text-center mb-16">
    //       <h2 className="text-4xl font-bold text-gray-900 mb-4">
    //         Frequently Asked Questions
    //       </h2>
    //       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    //         Got questions? We've got answers.
    //       </p>
    //     </div>
        
    //     <div className="max-w-3xl mx-auto">
    //       <Accordion type="single" collapsible className="space-y-4">
    //         {faqs.map((faq, index) => (
    //           <AccordionItem 
    //             key={index} 
    //             value={`item-${index}`}
    //             className="bg-white border rounded-lg px-6"
    //           >
    //             <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-red-600">
    //               {faq.question}
    //             </AccordionTrigger>
    //             <AccordionContent className="text-gray-600 text-base">
    //               {faq.answer}
    //             </AccordionContent>
    //           </AccordionItem>
    //         ))}
    //       </Accordion>
    //     </div>
    //   </div>
    // </section>
  );
}
