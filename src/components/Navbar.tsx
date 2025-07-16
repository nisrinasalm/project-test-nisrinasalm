import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

const menuItems = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Ideas", href: "/ideas" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > 80) {
        setIsScrolled(true);
        if (currentY > lastScrollY) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      } else {
        setIsScrolled(false);
        setShowNavbar(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-transform duration-300",
        showNavbar ? "translate-y-0" : "-translate-y-full",
        isScrolled ? "bg-[#ff6600]/80 backdrop-blur" : "bg-[#ff6600] shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-16 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Suitmedia Logo"
            width={82}
            height={33}
            priority
            className="filter"
          />
        </Link>

        <nav className="space-x-6 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "hover:text-white hover:underline hover:underline-offset-8 hover:decoration-2",
                "transition-colors text-white",
                pathname.startsWith(item.href) &&
                  "underline underline-offset-8 decoration-2"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
