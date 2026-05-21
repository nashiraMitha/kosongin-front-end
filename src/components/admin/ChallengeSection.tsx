"use client";

import {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";

import adminApi from "@/services/adminApi";
const api = adminApi;

export default function ChallengeSection() {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      category: "",
      duration: "",
      startDate: "",
    });

  /* FETCH CHALLENGES */
  useEffect(() => {

    fetchChallenges();

  }, []);

  const fetchChallenges = async () => {

    try {

      /* TOKEN */
      const token =
        Cookies.get(
          "admin_token"
        );

      /* API */
      const res =
        await api.get(
          "/api/admin/challenges",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "CHALLENGES:",
        res.data
      );

    } catch (err: any) {

      console.log(err);

      console.log(
        err.response?.status
      );

      console.log(
        err.response?.data
      );

    }
  };

  /* SUBMIT */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      /* TOKEN */
      const token =
        Cookies.get(
          "admin_token"
        );

      /* API */
      await api.post(
        "/api/admin/challenges",
        {
          title: form.title,

          description:
            form.description,

          fullDescription:
            form.description,

          rules:
            "Ikuti challenge sesuai aturan challenge.",

          howTo:
            "Selesaikan challenge setiap hari.",

          category:
            form.category,

          categoryTag:
            form.category,

          imageUrl:
            "https://picsum.photos/600/400",

          durationDays:
            Number(
              form.duration
            ),

          startDate:
            `${form.startDate} 00:00:00`,

          endDate:
            `${form.startDate} 23:59:59`,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      /* RESET */
      setForm({
        title: "",
        description: "",
        category: "",
        duration: "",
        startDate: "",
      });

      /* RESET */
      setForm({
        title: "",
      description: "",
        category: "",
        duration: "",
        startDate: "",
      });

      /* RELOAD PAGE */
      window.location.reload();

    } catch (err: any) {

      console.log(err);

      console.log(
        err.response?.status
      );

      console.log(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

      setError(
        err.response?.data
          ?.message ||
          "Gagal membuat challenge"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <span className="text-3xl text-[#032119]">
          +
        </span>

        <h2 className="text-4xl font-bold text-[#032119]">
          Manajemen Challenge
        </h2>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* JUDUL */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-2">
            Judul Challenge
          </label>

          <input
            type="text"
            placeholder="Nama Challenge..."
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            className="w-full border border-[#6E8B88] rounded-xl px-4 py-4 outline-none bg-transparent"
          />

        </div>

        {/* DESKRIPSI */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-2">
            Deskripsi
          </label>

          <textarea
            placeholder="Deskripsi challenge..."
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="w-full border border-[#6E8B88] rounded-xl px-4 py-4 outline-none bg-transparent min-h-[120px]"
          />

        </div>

        {/* KATEGORI */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-3">
            Kategori
          </label>

          <div className="flex flex-wrap gap-3">

            {[
              {
                name: "Zero Waste",
                border: "border-[#5FAE7B]",
                bg: "bg-[#EDF8F1]",
              },
              {
                name: "Secondhand",
                border: "border-[#C8B07A]",
                bg: "bg-[#FFF9EB]",
              },
              {
                name: "Eco Eating",
                border: "border-[#6B9BD9]",
                bg: "bg-[#EEF5FF]",
              },
              {
                name: "No Impulse Buy",
                border: "border-[#D96B6B]",
                bg: "bg-[#FFF1F1]",
              },
              {
                name: "Low Spend",
                border: "border-[#8B7AD1]",
                bg: "bg-[#F3EEFF]",
              },
            ].map((item) => (

              <button
                key={item.name}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    category: item.name,
                  })
                }
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  form.category === item.name
                    ? `${item.border} ${item.bg} font-semibold text-[#032119]`
                    : `${item.border} bg-[#FFFAF9] text-[#032119] hover:${item.bg}`
                }`}
              >

                {item.name}

              </button>

            ))}

          </div>

        </div>

        {/* ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DATE */}
          <div>

            <label className="block text-sm font-semibold text-[#032119] mb-2">
              Tanggal Mulai
            </label>

            <div className="relative">

              <input
                type="date"
                value={
                  form.startDate
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate:
                      e.target.value,
                  })
                }
                className="w-full border border-[#6E8B88] rounded-xl px-4 py-4 outline-none bg-transparent"
              />

            </div>

          </div>

          {/* DURASI */}
          <div>

            <label className="block text-sm font-semibold text-[#032119] mb-2">
              Durasi (hari)
            </label>

            <input
              type="number"
              placeholder="30"
              min={1}
              step={1}
              value={form.duration}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration:
                    e.target.value,
                })
              }
              className="w-full border border-[#6E8B88] rounded-xl px-4 py-4 outline-none bg-transparent"
            />

          </div>

        </div>

        {/* ERROR */}
        {error && (

          <div className="bg-red-100 text-red-600 text-sm p-4 rounded-xl">

            {error}

          </div>

        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#90BAB7] hover:bg-[#7DA7A4] transition-all text-white font-bold py-4 rounded-xl"
        >

          {loading
            ? "Loading..."
            : "Simpan Challenge"}

        </button>

      </form>

    </div>
  );
}