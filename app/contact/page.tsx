import GlareHover from "@/components/GlareHover";
import ContactSection from "@/components/shadcn-studio/blocks/contact-section/contact-section";
import Image from "next/image";

const ContactPage = () => {
  return (
    <>
      <ContactSection />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-accent/10 py-20">
        <a
          href="https://www.buymeacoffee.com/evanfeliza"
          target="_blank"
          rel="noopener noreferrer"
          className="z-10"
        >
          <GlareHover
            playOnce={false}
            transitionDuration={600}
            width="217"
            height="60"
          >
            <Image
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              width={217}
              height={60}
              className="drop-shadow-lg"
            />
          </GlareHover>
        </a>
        {/* Arrows positioned around the button */}
        <div className="absolute w-[400px] h-[400px] animate-spin-slow">
          <Image
            src="/arrows/arrow1.png"
            alt="arrow"
            width={200}
            height={200}
            className="absolute top-0 left-1/2 -translate-x-1/2 rotate-125"
          />
          <Image
            src="/arrows/arrow2.png"
            alt="arrow"
            width={100}
            height={100}
            className="absolute -right-25 top-1/2 -translate-y-1/2 rotate-100"
          />
          <Image
            src="/arrows/arrow3.png"
            alt="arrow"
            width={100}
            height={100}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rotate-200"
          />
          <Image
            src="/arrows/arrow4.png"
            alt="arrow"
            width={100}
            height={100}
            className="absolute -left-20 top-1/2 -translate-y-1/2 "
          />
          <Image
            src="/arrows/arrow5.png"
            alt="arrow"
            width={50}
            height={50}
            className="absolute top-8 left-8 rotate-140"
          />
        </div>
      </div>
    </>
  );
};

export default ContactPage;
