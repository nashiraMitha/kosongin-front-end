import { Consumption } from "@/types/consumption";
import ConsumptionItem from "./ConsumptionItem";

export default function ConsumptionList({ data }: { data: Consumption[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <ConsumptionItem key={item.id} item={item} />
      ))}
    </div>
  );
}