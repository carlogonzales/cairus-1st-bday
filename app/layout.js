import "@/assets/styles/global.css";


export const metadata = {
  title: "Cairus 1st Birthday!",
  description: "RSVP for a Jungle-themed 1st Birthday celebration. Countdown, details, and RSVP form.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#E2CDB5] text-[#78350F]">
        {children}
      </body>
    </html>
  );
}
