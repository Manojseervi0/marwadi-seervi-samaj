import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Marwadi Seervi Samaj",
  description: "Marwadi Seervi Samaj community portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
