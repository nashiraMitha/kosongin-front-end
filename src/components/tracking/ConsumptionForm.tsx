"use client";

import { useState } from "react";
import Image from "next/image";
import { Consumption } from "@/types/consumption";
import { useRef } from "react";

type Props = {
  onAdd: (data: Consumption) => void;
};

export default function ConsumptionForm({ onAdd }: Props) {

  const [form, setForm] = useState({
    name: "",
    category: "Lainnya",
    amount: "",
    date: "",
    note: "",
  });

  const [open, setOpen] = useState(false);

  const categories: string[] = [
    "Makanan & Minuman",
    "Fashion",
    "Elektronik",
    "Perawatan Diri",
    "Hiburan",
    "Lainnya",
  ];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
const dateRef = useRef<HTMLInputElement>(null);

  // ================= FILE HANDLER =================
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png"].includes(selected.type)) {
      setError("File harus JPG/PNG");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      setError("Max 2MB");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!form.name || !form.amount || !form.date) {
      alert("Isi semua field wajib!");
      return;
    }

    setLoading(true);

    const newData: Consumption = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      note: form.note || undefined,
      imageUrl: preview || undefined,
    };

    setTimeout(() => {
      onAdd(newData);
      setLoading(false);

      setForm({
        name: "",
        category: "Lainnya",
        amount: "",
        date: "",
        note: "",
      });

      setPreview(null);
      setFile(null);
    }, 500);
  };

  return (
    <div className="bg-[#FFFAF9] p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">

      {/* TITLE */}
      <div className="flex items-center gap-2">
        <Image src="/tracking.png" alt="tracking" width={20} height={20} />
        <h2 className="font-semibold text-lg">Consumption Tracker</h2>
      </div>

      {/* NAMA */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold">Nama Item</label>
        <input
          className="input"
          placeholder="Contoh: Adidas Cheongsam..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* DROPDOWN CUSTOM */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold">Kategori</label>

        <div className="relative">

          {/* BUTTON */}
          <div
            onClick={() => setOpen(!open)}
            className="input flex justify-between items-center cursor-pointer bg-white"
          >
            <span className="font-semibold">{form.category}</span>
            <span>⌄</span>
          </div>

          {/* LIST */}
          {open && (
            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-md z-50 overflow-hidden">

              {categories.map((item: string) => (
                <div
                  key={item}
                  onClick={() => {
                    setForm({ ...form, category: item });
                    setOpen(false);
                  }}
                  className={`px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                    item === form.category ? "bg-gray-50 font-semibold" : ""
                  }`}
                >
                  <span>{item}</span>

                  {item === form.category && (
                    <span className="text-[#568F87]">✔</span>
                  )}
                </div>
              ))}

            </div>
          )}
        </div>
      </div>

      {/* HARGA + TANGGAL */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold">Harga (Rp)</label>
          <input
            type="number"
            className="input mt-2"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-bold">Tanggal</label>

          <div
            onClick={() => dateRef.current?.showPicker?.() || dateRef.current?.click()}
            className="mt-2 cursor-pointer"
          >
            <input
              ref={dateRef}
              type="date"
              className="input w-full"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* CATATAN */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold">Catatan (opsional)</label>
        <textarea
          className="input h-36"
          placeholder="Sale, self reward, repeat order..."
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      {/* UPLOAD */}
      <div>
        <label className="text-sm font-bold">Foto struk / barang (opsional)</label>

        <div className="mt-2 border-2 border-solid border-black h-40 flex items-center justify-center relative rounded-xl cursor-pointer
        bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)]
        bg-[size:20px_20px]
        bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFile}
            className="absolute inset-0 opacity-0"
          />

          {preview ? (
            <img src={preview} className="h-full w-full object-cover rounded-xl" />
          ) : (
            <div className="text-center text-gray-500 text-sm">
              <p>📷</p>
              <p>Klik / seret untuk mengunggah foto ke sini</p>
              <p className="text-xs">(JPG, PNG — maks. 2 MB)</p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      {/* BUTTON */}
      <div className="space-y-2">
        <p className="text-l text-black">
        Sistem tidak memverifikasi foto/struk secara otomatis. Data berdasarkan input manual. </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#568F87] text-white py-4 rounded-xl font-semibold text-lg"
        >
          {loading ? "Menyimpan..." : "Simpan catatan"}
        </button>
      </div>

    </div>
  );
}