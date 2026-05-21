import Image from "next/image";
import Link from "next/link";

export default function Community() {
  return (
    <section id="komunitas" className="py-16 md:py-24 bg-[#f5f5f3]">

      {/* CONTAINER */}
      <div className="px-4 md:px-16 lg:px-24">

        {/* TITLE */}
        <h2 className="text-2xl md:text-4xl font-bold mb-10 md:mb-16">
          Community Preview
        </h2>

        {/* SCROLL */}
        <div className="flex gap-5 md:gap-8 overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden">

          {[
            {
              title: "30 Hari Tanpa Fast Fashion",
              image: "/challenge/one.png",
              desc: "Tantang dirimu untuk tidak membeli pakaian baru selama 30 hari penuh.",
              participants: 312,
              duration: "7 hari",
            },
            {
              title: "Zero Plastic Weekend",
              image: "/challenge/two.png",
              desc: "Dua hari akhir pekan tanpa plastik sekali pakai.",
              participants: 234,
              duration: "7 hari",
            },
            {
              title: "No Impulse Buy Week",
              image: "/challenge/three.png",
              desc: "7 hari penuh tanpa klik \"Beli Sekarang\" tanpa pikir panjang.",
              participants: 196,
              duration: "7 hari",
            },
            {
              title: "Makan Lokal Challenge",
              image: "/challenge/four.jpg",
              desc: "Hindari delivery food dan makan hanya dari restoran lokal selama seminggu.",
              participants: 145,
              duration: "7 hari",
            },
          ].map((item, i) => (

            <div
              key={i}
              className="bg-white rounded-2xl md:rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition w-[clamp(220px,28vw,340px)] flex-shrink-0 flex flex-col"
            >

              {/* IMAGE */}
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={600}
                className="w-full aspect-square object-cover"
              />

              {/* CONTENT */}
              <div className="p-3 md:p-5 flex flex-col flex-1">

                {/* TAG */}
                <span className="inline-block border border-[#568F87] text-[#568F87] px-3 py-1 rounded-full text-[10px] md:text-sm w-fit">
                  Zero Waste
                </span>

                {/* TITLE */}
                <h3 className="mt-3 md:mt-5 text-base md:text-lg font-bold h-[60px] md:h-[70px]">
                  {item.title}
                </h3>

                {/* DESC */}
                <p className="text-xs md:text-[12px] text-black mt-3 leading-relaxed h-[60px] md:h-[70px]">
                  {item.desc}
                </p>

                {/* BOTTOM */}
                <div className="mt-auto pt-5 md:pt-8">

                  {/* INFO */}
                  <div className="flex items-center gap-2 text-xs md:text-[12px] text-black mb-3 md:mb-4">

                    <Image
                      src="/user.png"
                      alt="user"
                      width={12}
                      height={12}
                      className="w-3 h-3 md:w-4 md:h-4"
                    />

                    <span>{item.participants} peserta</span>

                    <span>|</span>

                    <span>{item.duration}</span>

                  </div>

                  {/* BUTTON */}
                  <div className="flex justify-start">

                    <Link href="/login">

                      <button className="w-fit bg-[#90BAB7] hover:bg-[#4a7a73] text-white font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-[12px] transition active:scale-95">

                        <div className="flex items-center justify-center gap-2 font-bold">

                          <span>Ikuti Challenge</span>

                        </div>

                      </button>

                    </Link>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}