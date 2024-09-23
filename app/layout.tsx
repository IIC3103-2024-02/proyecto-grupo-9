import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar";


export const metadata: Metadata = {
    title: "Proyecto grupo 9",
    description: "Proyecto grupo 9",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            
            <body>
                
                <Navbar />
                {children}
            </body>
        </html>
    );
}
