import Image from "next/image";
import meta from "@/app/meta.json";

export default function Home() {
  // console.log(meta);
  return (
    <ul>
      {meta.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
