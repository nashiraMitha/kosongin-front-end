export default function ChallengeSection() {
  return (
    <section className="py-16 bg-red-50 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-red-900 mb-6">Tantangan Saat Ini</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
            <p className="text-red-700 font-medium">Proses manual yang memakan waktu lama.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
            <p className="text-red-700 font-medium">Kurangnya standarisasi format dokumen.</p>
          </div>
        </div>
      </div>
    </section>
  );
}