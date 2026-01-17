import Image from "next/image";
import background from "@/assets/images/background.svg"
import treetopLeft from "@/assets/images/treetop_left.svg"
import treetopRight from "@/assets/images/treetop_right.svg"


const TopBackground = () => {
    return (
        <>
            <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
                <Image src={background} alt="" className="h-full w-full object-cover object-left" width={0} height={0} />
            </div>

            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <Image src={treetopLeft} alt="" className="absolute top-0 left-0 max-w-none" width={0} height={0} />
                <Image src={treetopRight} alt="" className="absolute top-0 right-0 max-w-none" width={0} height={0} />
            </div>
        </>
    )
};

export default TopBackground;
