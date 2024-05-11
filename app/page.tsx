import Image from "next/image";
import { Chat } from "./Chat";

export default function Home() {
  return (
    <div className="flex justify-center ">
      <div className="md:w-1/2">
        <Chat />
      </div>
    </div>
  );
}
