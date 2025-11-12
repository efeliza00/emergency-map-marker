import { Server } from "lucide-react";

const ContactSection = () => {
  return (
    <div className=" max-w-full min-h-[calc(100dvh-4rem)] bg-accent">
      <div className="max-w-7xl mx-auto py-20">
        <div className=" bg-green-300/20  rounded-md drop-shadow-md p-4 mx-auto w-fit aspect-square">
          <Server className="mx-auto size-20 text-green-500" />
        </div>
        <h1 className="text-6xl font-semibold tracking-tight leading-44 text-center">
          Keeping Our Services Online{" "}
          <span className="relative">
            24/7
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
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <p className="text-xl">
          Our commitment is to provide reliable, uninterrupted access to our
          website&apos;s services around the clock. Maintaining the
          infrastructure and constant surveillance requires dedicated resources.
        </p>
        <br />
        <p className="text-xl">
          We would be incredibly grateful for any contribution you can make to
          our operational fund. Your support ensures the continuous availability
          and performance of this site.
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
