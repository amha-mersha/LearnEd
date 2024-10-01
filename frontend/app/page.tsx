import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  redirect(`/dashboard`)
}
