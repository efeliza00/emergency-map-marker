import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  return (
    <div className="max-w-full mx-auto w-full">
      <div className="py-10 bg-primary  text-center text-4xl tracking-tight font-medium">
        <h1 className="text-accent">Frequently Asked Questions</h1>
      </div>
      <Accordion
        type="single"
        collapsible
        className="max-w-4/5 md:max-w-3/5 mx-auto my-10"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>What is this website for?</AccordionTrigger>
          <AccordionContent>
            This website allows users to quickly report emergencies and request
            help from nearby responders.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How do I submit an emergency request?
          </AccordionTrigger>
          <AccordionContent>
            Share your location, fill out the form, and tap “Submit” to send
            your emergency details.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Why does the app need my location?
          </AccordionTrigger>
          <AccordionContent>
            Your location helps responders reach you faster and accurately.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How long before help arrives?</AccordionTrigger>
          <AccordionContent>
            Response time depends on your location and available responders
            nearby.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Can I update or cancel a request?</AccordionTrigger>
          <AccordionContent>
            No. Be mindful of the information you submit.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FaqSection;
