import { getCards } from "@/actions/cards";
import { notFound } from "next/navigation";
import JeuxCoupleContent from "@/components/dashboard/vieCouple/jeux-couple";

export default async function JeuxCartesPage() {
  const res = await getCards();
  if (res.error) return notFound();

  const cards = res.data;

  return <JeuxCoupleContent/>;
}
