import { useLanguage } from "@/hooks/useLanguage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6'),
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <Badge variant="outline" className="mb-3 sm:mb-4">
            <HelpCircle className="w-3 h-3 mr-1" />
            {t('faq.badge')}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {t('faq.title')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('faq.description')}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-lg sm:rounded-xl border-2 border-border/50 px-4 sm:px-6 shadow-sm hover:shadow-md transition-shadow data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4 sm:py-5 text-sm sm:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 leading-relaxed text-sm sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
