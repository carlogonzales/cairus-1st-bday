import Image from "next/image";
import banana from "@/assets/images/banana.svg"

const HeroBanner = () => {
  return (
    <div
      className="flex items-center gap-5 rounded-3xl border-4 border-[#AB8653] bg-[#AB8653] p-8 shadow-sm backdrop-blur">
      <div className="shrink-0">
        <Image src={banana} alt="Banana Icon" width={0} height={0} />
      </div>
      <h1 className="text-4xl sm:text-2xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-[34px]">
        Come join our little explorer’s <span className="text-[#FFCB40]">1st Birthday</span>!
      </h1>
    </div>
  );
};

export default HeroBanner;
