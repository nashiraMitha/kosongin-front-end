import { Consumption } from "@/types/consumption";

export default function ConsumptionItem({ item }: { item: Consumption }) {
  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center">

      <div className="flex gap-3 items-center">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            className="w-12 h-12 object-cover rounded"
          />
        )}

        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-gray-500">
            {item.category} • {item.date}
          </p>
        </div>
      </div>

      <p className="text-red-500 font-semibold">
        Rp {item.amount.toLocaleString("id-ID")}
      </p>
    </div>
  );
}