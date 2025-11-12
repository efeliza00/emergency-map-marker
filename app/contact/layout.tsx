import React from "react";
import Header, {
  NavigationSection,
} from "@/components/shadcn-studio/blocks/hero-section-01/header";

const layout = ({ children }: { children: React.ReactNode }) => {
  const navigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Contacts",
      href: "/contact",
    },
  ];

  return (
    <div className="relative">
      <Header navigationData={navigationData} />
      {children}
    </div>
  );
};

export default layout;
