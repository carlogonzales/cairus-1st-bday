import TopBackground from "@/components/TopBackground";
import HeaderRsvp from "@/components/HeaderRsvp";
import MainContent from "@/components/main/MainContent";
import BottomBackground from "@/components/main/BottomBackground";

export default function Home() {
  return (
    <>
      <TopBackground />
      <HeaderRsvp />

      <MainContent />

      <BottomBackground />

    </>
  );
}
