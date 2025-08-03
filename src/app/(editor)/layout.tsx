import MenuButton from "@/components/MenuButton";
import "@/app/globals.css";
import { UserProvider } from "@/context/UserContext";

const metadata = {
  title: "OxyPaste",
  description: "A PasteBin Service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body className="w-full h-full p-5 no-scroll">
        <UserProvider>
          <div className="h-screen flex flex-col">
            <main className="flex flex-auto w-full overflow-hidden pb-5">
              <div className="fixed top-4 right-4 z-30">
                <MenuButton />
              </div>
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
