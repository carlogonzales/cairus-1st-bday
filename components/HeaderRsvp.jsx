
import lion from '@/assets/images/lion.svg';
import tiger from '@/assets/images/tiger.svg';
import cairusTurns1 from '@/assets/images/cairus_turns_1.svg';
import Image from "next/image";


const HeaderRsvp = () => {
    return (
        <header className="relative mx-auto max-w-5xl px-4 pt-6 sm:px-6">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2"></div>
                <a href="#rsvp"
                   className="hidden rounded-full bg-[#FFCB40] px-4 py-2 text-sm font-semibold text-[#78350F] shadow-sm hover:bg-[#E6B83A] sm:inline-flex">
                    RSVP Now
                </a>
            </div>
            <div className="w-full flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
                <div className="flex items-center justify-center gap-2 md:contents">
                    <div className="md:self-center scale-75 sm:scale-90 md:scale-100 origin-center">
                        <Image src={lion} alt="Lion Image" className="object-contain" width={0} height={0} />
                    </div>
                    <div className="md:hidden scale-75 sm:scale-90 md:scale-100 origin-center">
                        <Image src={tiger} alt="Tiger Image" className="object-contain" width={0} height={0} />
                    </div>
                </div>
                <div className="md:self-center">
                    <Image src={cairusTurns1} alt="Happy Birthday Cairus" width={0} height={0} />
                </div>
                <div className="hidden md:block md:self-center">
                    <Image src={tiger} alt="Tiger Image" width={0} height={0} />
                </div>
            </div>
        </header>
    );
};

export default HeaderRsvp;
