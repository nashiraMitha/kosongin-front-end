import Image from "next/image";

export default function About() {
  return (
    <section className="relative w-full py-32 overflow-hidden">

      {/* BG DESKTOP */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/bck.png')" }}
      />

      {/* BG MOBILE */}
      <div
        className="absolute inset-0 block md:hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* CONTENT */}
      <div className="relative w-full px-8 md:px-16 lg:px-24 text-justify">

        {/* LOGO */}
        <Image
          src="/Logo1.svg"
          alt="Logo"
          width={120}
          height={120}
          className="mx-auto mb-12"
        />

        <h2 className="hidden md:block text-center text-3xl md:text-4xl font-heading font-bold">
          Platform “rem digital”{" "}
          <span className="text-[#3D6660]">
            untuk Gen Z dan Millenial
          </span>
        </h2>

        <h2 className="block md:hidden text-center text-2xl font-heading font-bold leading-tight">
          Platform “rem digital”
          <br />
          <span className="text-[#3D6660]">
            untuk Gen Z dan Millenial
          </span>
        </h2>

        <div className="mt-60 w-full px-2 md:px-6 lg:px-10 text-xl leading-relaxed">

          <p className="max-w-lg">
            Kosongin hadir sebagai ruang refleksi konsumsi, bukan untuk menghakimi, tapi untuk membantu kamu sadar dan berubah sedikit demi sedikit.
          </p>

          <p className="max-w-lg md:ml-auto md:mt-32 mt-12">
            Lebih dari 60% Gen Z peduli lingkungan — tapi kesulitan mengubah kebiasaan belanja mereka. Kosongin hadir bukan untuk menyalahkan, tapi sebagai teman yang membantu kamu sadar satu langkah lebih awal dari checkout.
          </p>

        </div>

      </div>
    </section>
  );
}