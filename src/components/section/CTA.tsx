import Link from "next/link";

export default function CTA() {
  return (
    <section id="daftar" className="relative overflow-hidden py-80 bg-gradient-to-r from-[#FFFAF9] to-[#efe9e9]">
      {/* BLUR ATAS */}
      <div className="absolute top-[-120px] right-[-60px] w-[900px] h-[500px]
      bg-gradient-to-br from-[#FFFAF9] via-[#F5BABB] to-transparent
      blur-[140px] opacity-60 rounded-full"></div>

      {/* BLUR BAWAH */}
      <div className="absolute bottom-[-120px] left-[-60px] w-[700px] h-[400px]
      bg-gradient-to-tr from-[#FFFAF9] via-[#F5BABB] to-transparent
      blur-[140px] opacity-50 rounded-full"></div>

      <div className="relative px-6 flex flex-col items-center justify-center text-center">

        <h2 className="text-3xl md:text-4xl gap-14 font-heading font-bold">
          Siap mulai lebih mindful?
        </h2>

        <p className="mt-14 text-black text-lg md:text-2xl leading-relaxed text-justify max-w-[750px] text-center mx-auto">
          Kosongin gratis dan tidak akan ceramahin kamu. Banyak Gen Z dan Millennial sudah mulai perjalanan konsumsi secara sadar mereka. Cukup dari satu langkah kecil hari ini.
        </p>

        <Link href="/login">
          <button className="mt-24 bg-[#90BAB7] hover:bg-[#4a7a73] text-white font-bold px-5 md:px-16 py-3 md:py-5 rounded-xl text-[14px] md:text-2xl">
            Mulai Sekarang — Gratis
          </button>
        </Link>

      </div>
    </section>
  );
}