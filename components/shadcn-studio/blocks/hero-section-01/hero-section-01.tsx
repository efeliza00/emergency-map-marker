import AnimatedContent from "@/components/animated-components/animated-content";
import FadeContent from "@/components/FadeContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FaqSection from "./faq-section";
import UserFlowSection from "./user-flow-section";
const HeroSection = () => {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24">
      {/* Hero Content */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={true}
          duration={1.5}
          ease="cine.out"
          initialOpacity={0}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={1}
        >
          <div className="bg-muted flex flex-col md:flex-row items-center gap-2.5 rounded-lg relative md:relative md:rounded-full border px-3 py-2">
            <Badge className="rounded-full absolute md:relative -top-2.5 md:top-auto md:order-first">
              Built for the Community
            </Badge>
            <span className="text-muted-foreground md:flex-1">
              Making emergency response quicker, safer, and more connected.
            </span>
          </div>
          A
        </AnimatedContent>

        <FadeContent
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
        >
          <h1 className="text-2xl md:text-3xl leading-[1.29167] font-bold text-balance sm:text-4xl lg:text-6xl">
            Mark your
            <br />
            <span className="relative">
              Location
              <svg
                width="223"
                height="12"
                viewBox="0 0 223 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden"
              >
                <path
                  d="M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551"
                  stroke="red"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            for an emergency help!
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl leading-10">
            Stay safe — let others find you when you need help the most.
          </p>
          <Button size="lg" asChild className="my-10">
            <a href="/map">Ask for help</a>
          </Button>
        </FadeContent>
      </div>
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        duration={1}
        ease="sine.in"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0}
      >
        <Image
          src="/emergency-vectors/banner.jpg"
          height={1000}
          width={1000}
          alt="banner image"
          className="mx-auto w-full object-cover grayscale drop-shadow-md select-none h-48 md:h-64 lg:h-80"
        />
      </AnimatedContent>
      <UserFlowSection />
      <FaqSection />
    </section>
  );
};

export default HeroSection;
