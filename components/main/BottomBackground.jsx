

import footerBackground from "@/assets/images/footer_background.svg";
import footerLeftFoliage from "@/assets/images/footer_left_foliage.svg";
import footerRightFoliage from "@/assets/images/footer_rigth_foliage.svg";
import Image from "next/image";

const BottomBackground = () => {
  return (
    <div className="pointer-events-none relative w-full h-0 overflow-visible">
      <Image
        src={footerBackground}
        alt=""
        className="absolute bottom-0 left-0 z-10 w-full h-auto"
        width={0}
        height={0}
      />
      <div className="absolute left-0 bottom-0 -translate-y-[45%] z-0">
        <Image src={footerLeftFoliage} alt="" className="w-[18vw] h-auto max-w-none"
             width={0}
             height={0} />
      </div>

      <div className="absolute right-0 bottom-0 -translate-y-[45%] z-0 ">
        <Image src={footerRightFoliage} alt="" className="w-[18vw] h-auto max-w-none" />
      </div>
    </div>
  );
};

export default BottomBackground;
