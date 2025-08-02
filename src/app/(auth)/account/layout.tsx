import "@/app/globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faHome,
  faPencil,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { UserProvider } from "@/context/UserContext";
import MenuButton from "@/components/MenuButton";

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
      <body className="bg-gray-950 text-white font-sans antialiased">
        <UserProvider>
          <ClientNavButton />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}

function ClientNavButton() {
  return (
    <div className="z-50 fixed top-4 right-4 flex gap-2">
      <MenuButton />
      {/* <a
        href="/"
        title="Open Editor"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:text-blue-400 transition duration-200 border border-white/10 shadow-md"
      >
        <FontAwesomeIcon icon={faPencilAlt} className="w-5 h-5" />
      </a> */}
    </div>
  );
}
