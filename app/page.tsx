import Image from "next/image";
import { Chat } from "./Chat";
import { Header } from "./Header";
export default function Home() {
  return (
    <div className="">
      <div className="md:flex md:items-center md:justify-center">
        <Chat />
      </div>
    </div>
  );
}
