import HeroBanner from "@/components/main/HeroBanner";
import CountDownContent from "@/components/main/CountDownContent";
import GuestPrep from "@/components/main/GuestPrep";
import connectorImage from "@/assets/images/connector.svg";
import monkeyHangingImage from "@/assets/images/monkey_hanging.svg";
import Image from "next/image";

const InfoPane = () => {
  return (
    <div className="lg:col-span-7">
      <HeroBanner/>
      <div className="w-full px-6 sm:px-8">
        <div className="h-6 md:h-12 overflow-hidden">
          <Image src={connectorImage} className="w-full h-full object-cover object-center block" alt="" width={0}
                 height={0}/>
        </div>
      </div>
      <CountDownContent/>
      <div className="w-full px-6 sm:px-8">
        <div className="h-6 md:h-12 overflow-hidden">
          <Image src={connectorImage} className="w-full h-full object-cover object-center block" alt="" width={0}
                 height={0}/>
        </div>
      </div>
      <GuestPrep/>
      <div>
        <div className="relative overflow-visible">
          <Image src={monkeyHangingImage} alt="" className="relative z-40 mx-auto -mt-5 -mb-16" width={0} height={0} />
        </div>
      </div>
    </div>
  );
};

export default InfoPane;
