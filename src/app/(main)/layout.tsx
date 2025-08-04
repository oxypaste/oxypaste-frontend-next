import "@/app/globals.css";
import { UserProvider } from "@/context/UserContext";
import MenuButton from "@/components/MenuButton";
import Footer from "@/components/Footer";

export const metadata = {
  title: "OxyPaste Account Centre",
  description: "Description here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-white font-sans antialiased bg-white">
        <UserProvider>
          <ClientNavButton />
          <main className="bg-[#0d0f14] text-white">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}

function ClientNavButton() {
  return (
    <div className="z-50 fixed top-4 right-4 flex gap-2">
      <MenuButton />
    </div>
  );
}
