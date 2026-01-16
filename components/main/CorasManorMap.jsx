
import wazeIconImage from "@/assets/images/waze_icon.svg";
import gmapsIconImage from "@/assets/images/gmaps_icon.svg";
import Image from "next/image";

const CorasManorMap = () => {
  return (

    <section id="coras-manor"
             className="relative z-30 mt-10 rounded-3xl border-4 border-[#AB8653] bg-[#FEF6E1] p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-extrabold text-[#78350F]">Where to Celebrate</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=16.0322038,120.450968"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center rounded-full bg-[#FFCB40] px-5 py-2 text-sm font-bold text-[#78350F] hover:bg-[#E6B83A]"
        >
          <Image src={gmapsIconImage} alt="" className="h-5 w-5 object-contain flex-shrink-0" width={0}
                 height={0}/> &nbsp; Drive with Google Maps
        </a>

        <a
          href="https://waze.com/ul?ll=16.0322038,120.450968&navigate=yes"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center rounded-full bg-[#E2CDB5] px-5 py-2 text-sm font-bold text-[#78350F] hover:bg-[#D6BFA4]"
        >
          <Image src={wazeIconImage} alt="" className="h-5 w-5 object-contain flex-shrink-0" width={0}
                 height={0}/> &nbsp; Drive with Waze
        </a>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#AB8653]/40">
        <iframe
          title="Coras Manor Map"
          className="h-[360px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Coras%20Manor&output=embed">
        </iframe>
      </div>
    </section>
  );
};

export default CorasManorMap;
