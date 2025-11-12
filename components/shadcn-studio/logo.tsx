import Image from "next/image";
// Util Imports
import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/">
      <div className={cn("flex items-center gap-2.5", className)}>
        <Image src="/logo.png" height={40} width={40} alt="logo" />
        <span className="text-xl font-medium tracking-tight">
          Code<span className="text-red-600">Red</span>Map
        </span>
      </div>
    </Link>
  );
};

export default Logo;
