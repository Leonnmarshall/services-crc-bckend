import "./globals.css";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
	title: "Monitora CRC",
	description:
		"Plataforma de monitoramento dos direitos da criança e do adolescente",
};

export default function RootLayout({children}) {
	return (
		<html lang='pt-BR'>
			<body className='bg-neutral-50 text-neutral-900'>
				<Header />
				<MegaMenu />
				<main className='min-h-screen'>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
