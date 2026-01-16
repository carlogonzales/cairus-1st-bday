import Image from "next/image";
import background from "@/assets/images/background.svg"
import treeTop from "@/assets/images/tree_top.svg"


const TopBackground = () => {
    return (
        <>
            <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
                <Image src={background} alt="" className="h-full w-full object-cover object-left" width={0} height={0} />
            </div>

            <div className="pointer-events-none fixed top-0 left-0 -z-10 w-full overflow-hidden">
                <Image src={treeTop} alt="" className="ml-auto w-auto h-auto max-w-none" width={0} height={0} />
            </div>
        </>
    )
};

export default TopBackground;