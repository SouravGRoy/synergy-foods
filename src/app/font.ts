import { DM_Sans, Rubik, Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Playfair_Display, Merriweather } from "next/font/google";

export const dmsans = DM_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "800", "900", "1000"],
    display: "swap",
    variable: "--font-dmsans",
});

export const rubik = Rubik({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-rubik",
});

export const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-inter",
});

export const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    display: "swap",
    variable: "--font-roboto",
});

export const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-open-sans",
});

export const lato = Lato({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    variable: "--font-lato",
});

export const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-poppins",
});

export const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-playfair-display",
});

export const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    variable: "--font-merriweather",
});