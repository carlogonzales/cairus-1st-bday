import InfoPane from "@/components/main/InfoPane";
import RsvpPane from "@/components/main/RsvpPane";
import CorasManorMap from "@/components/main/CorasManorMap";
import TravelToPangasinan from "@/components/main/TravelToPangasinan";
import Footer from "@/components/main/Footer";
import Image from "next/image";

import footerLionImage from "@/assets/images/footer_lion.svg";
import footerElephantImage from "@/assets/images/footer_elephant.svg";


const MainContent = () => {
  return (
    <main className="mx-auto max-w-5xl mt-6 md:mt-4 px-4 pb-12 pt-6 sm:px-6">
      <section className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <InfoPane/>
        <RsvpPane/>
      </section>
      <CorasManorMap/>
      <TravelToPangasinan/>

      <Footer/>

      <div className="relative z-20 w-full">
        <div className="lg:hidden pointer-events-none relative flex items-end justify-between px-4 sm:px-8">
          <div className="h-auto w-[42vw] sm:w-[28vw] max-w-none -translate-x-[-20%]">
            <Image src={footerLionImage} alt="" className="" width={0} height={0} />
          </div>
          <div className="h-auto w-[48vw] sm:w-[30vw] md:w-[22vw] max-w-none -translate-x-[10%]">
            <Image src={footerElephantImage} alt="" className="" width={0} height={0} />
          </div>
        </div>
        <div
          className="hidden lg:flex pointer-events-none absolute left-0 right-0 bottom-0  items-end justify-between px-4 sm:px-8 -translate-y-[25%]">
          <div className="h-auto w-[42vw] sm:w-[28vw] max-w-none -translate-x-[40%]">
            <Image src={footerLionImage} alt="" className="" width={0} height={0} />
          </div>
          <div className="h-auto w-[48vw] sm:w-[30vw] md:w-[22vw] max-w-none -translate-x-[-65%]">
            <Image src={footerElephantImage} alt="" className="" width={0} height={0} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
