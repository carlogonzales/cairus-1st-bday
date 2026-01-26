import Link from "next/link";
import Image from "next/image";
import messengerIconImage from "@/assets/images/messenger.svg";


const Footer = () => {
  return (
    <footer
      className="relative z-30 mt-10 rounded-3xl border border-[#78350F] bg-[#78350F] p-4 text-center text-sm text-white shadow-sm backdrop-blur sm:p-8">
      <p className="font-semibold text-white">See you in the jungle! 🦓🦒🐘</p>
      <p className="mt-2">
        Questions? Message the parents anytime. {"  "}

        <span className="inline-flex flex-wrap items-center gap-2 font-bold">
          <Link
            href="https://m.me/carlo.a.gonzales"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline decoration-[#FEF6E1] decoration-2 underline-offset-2 text-[#FFCB40] hover:text-white"
          >
            <Image
              src={messengerIconImage}
              alt=""
              height={16}
              width={16}
              className="align-middle"
            />
            <span className="leading-none">Carlo Gonzales</span>
          </Link>
          <span className="inline-flex items-center gap-2 font-bold">{" / "}</span>
          <Link
            href="https://m.me/eiipyon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline decoration-[#FEF6E1] decoration-2 underline-offset-2  text-[#FFCB40] hover:text-white"
          >
            <Image
              src={messengerIconImage}
              alt=""
              height={16}
              width={16}
              className="align-middle"
            />
            <span className="leading-none">April Joy Gonzales</span>
          </Link>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
