export interface Consumption {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
  imageUrl?: string;
}