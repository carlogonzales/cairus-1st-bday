
import hatImage from "@/assets/images/hat.svg";
import childrenPlayingImage from "@/assets/images/children_playing.svg";
import foodImage from "@/assets/images/food.svg";
import giftImage from "@/assets/images/gift.svg";
import Image from "next/image";

const GuestPrep = () => {
  return (
    <div
      className="relative z-50 rounded-3xl border-4 border-[#AB8653] bg-[#FEF6E1] p-6 shadow-sm backdrop-blur sm:p-8">
      <h2 className="text-lg font-extrabold text-[#78350F]">Quick details to help you prep</h2>
      <p className="mt-2 text-sm text-[#78350F]">
        Here are a few things that make the day smoother for everyone.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#748F52] bg-[#748F52] p-4">
          <Image src={hatImage} alt="" className="h-[46px] w-[46px] object-contain" width={0} height={0} />
          <p className="mt-2 text-sm font-bold text-white">What to wear</p>
          <p className="mt-0.5 text-sm text-white">
            Light, comfy outfits (greens / earthy tones are welcome).
          </p>
        </div>
        <div className="rounded-2xl border border-[#66BB9D] bg-[#66BB9D] p-4">
          <Image src={childrenPlayingImage} alt="" className="h-[46px] w-[46px] object-contain" width={0} height={0} />
          <p className="mt-2 text-sm font-bold text-white">Kids-friendly</p>
          <p className="mt-0.5 text-sm text-white">
            Kid-friendly venue with a pool—please supervise children, especially near the water and
            decorations.
          </p>
        </div>
        <div className="rounded-2xl border border-[#ECB543] bg-[#ECB543] p-4">
          <Image src={foodImage} alt="" className="h-[46px] w-[46px] object-contain" width={0} height={0} />
          <p className="mt-2 text-sm font-bold text-white">Food &amp; seating</p>
          <p className="mt-0.5 text-sm text-white">
            Your RSVP helps us prepare enough food and comfortable seating for all our guests.
          </p>
        </div>
        <div className="rounded-2xl border border-[#AB8653] bg-[#AB8653] p-4">
          <Image src={giftImage} alt="" className="h-[46px] w-[46px] object-contain" width={0} height={0} />
          <p className="mt-2 text-sm font-bold text-white">Gifts (optional)</p>
          <p className="mt-0.5 text-sm text-white">
            Your <strong>presence</strong> means the most. Optional gifts: educational toys or
            essentials for <strong>ages 2–3</strong>.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#ECB543] bg-[#FFEEC6] p-4">
        <p className="text-sm font-semibold text-[#78350F]">Tip</p>
        <p className="mt-1 text-sm text-[#78350F]">
          Please <strong>RSVP early</strong> so we can prepare enough food, seating, and party favors for
          everyone. Thank you!
        </p>
      </div>
    </div>
  );
};

export default GuestPrep;
