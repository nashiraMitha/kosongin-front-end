import Image from "next/image";

export default function Features() {
  return (
    <section id="fitur" className="py-24 bg-[#f5f5f3] overflow-hidden">

      <div className="px-6 md:px-16 lg:px-24">

        {/* HEADING */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-10">
          Fitur <span className="text-[#568F87]">Utama</span>
        </h2>

        {/* GRID / SCROLL MOBILE */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 [&::-webkit-scrollbar]:hidden">

          {[
            {
              title: "Consumption Tracking",
              icon: "/tracking.png",
              desc: "Catat dan lihat ringkasan konsumsi harianmu secara visual.",
            },
            {
              title: "Impulse Shield",
              icon: "/shield.png",
              desc: "Rem digitalmu sebelum checkout. Tunda, pikir dua kali, hemat lebih banyak.",
            },
            {
              title: "Community Challenges",
              icon: "/community.png",
              desc: "Tantangan kolektif untuk konsumsi yang lebih bertanggung jawab.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-[#A2C5C3] via-[#74A9A5] to-[#6A9A96] p-8 rounded-3xl shadow-sm hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-center aspect-[4/3] min-w-[280px] md:w-full"
            >

              {/* ICON */}
              <Image
                src={item.icon}
                alt={item.title}
                width={40}
                height={40}
                className="mb-5"
              />

              {/* TITLE */}
              <h3 className="text-[19px] md:text-xl font-bold text-black">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-black mt-6 text-center text-[14px] md:text-sm leading-relaxed max-w-[220px]">
                {item.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}