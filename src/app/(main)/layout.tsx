import "@/app/globals.css";
import { UserProvider } from "@/context/UserContext";
import MenuButton from "@/components/MenuButton";
import Footer from "@/components/Footer";

export const metadata = {
  title: "OxyPaste",
  description: "OxyPaste is open-source Pastebin software.",
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
          <main>{children}</main>
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
