import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FFFAF9] py-14 border-t">

      <div className="w-full px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-start justify-between gap-10">

        {/* LOGO */}
        <div>

          <Link href="/" className="group">

            <Image
              src="/logo1.svg"
              alt="Logo"
              width={60}
              height={60}
              className="mb-6 transition-transform duration-300 group-hover:scale-105"
            />

            <h1 className="font-bold font-heading text-3xl md:text-4xl transition-colors duration-300 group-hover:text-[#568F87]">
              Kosongin
            </h1>

          </Link>

        </div>

        {/* HOME */}
        <div>

          <p className="font-bold mb-6 text-lg md:text-xl">
            Home
          </p>

          <div className="flex flex-col gap-4">

            <Link href="#fitur" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Fitur
            </Link>

            <Link href="#cara-kerja" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Cara Kerja
            </Link>

            <Link href="#komunitas" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Komunitas
            </Link>

          </div>

        </div>

        {/* CONTACT */}
        <div>

          <p className="font-bold mb-6 text-lg md:text-xl">
            Contact Us
          </p>

          <div className="flex flex-col gap-4">

            <Link href="https://www.gmail.com" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Email
            </Link>

            <Link href="https://www.instagram.com" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Instagram
            </Link>

            <Link href="https://www.linkedin.com" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              LinkedIn
            </Link>

          </div>

        </div>

        {/* LEGAL */}
        <div>

          <p className="font-bold mb-6 text-lg md:text-xl">
            Legal
          </p>

          <div className="flex flex-col gap-4">

            <Link href="/" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Privacy Policy
            </Link>

            <Link href="/" className="text-black text-base md:text-lg hover:text-[#568F87] transition-colors">
              Terms of Service
            </Link>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="w-full md:w-auto pt-6 md:pt-0">

          <p className="text-left md:text-right text-sm md:text-base text-black">
            © 2026 Veteran Tech
          </p>

        </div>

      </div>

    </footer>
  );
}