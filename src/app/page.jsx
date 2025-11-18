import Banner from "@/components/Banner";
import CardsSection from "@/components/CardsSection";
import ComentariosGerais from "@/components/ComentariosGerais";
import ExplicacaoSection from "@/components/ExplicacaoSection";
import MoninhaSection from "@/components/MoninhaSection";
import PublicacoesCarousel from "../components/PublicacoesCarousel";
import RealizacaoApoio from "@/components/RealizacaoApoio";


export default function Home() {
	return (
		<main className='flex flex-col gap-20'>
			<Banner />
			<ExplicacaoSection />
			<CardsSection />
			<MoninhaSection />
			<ComentariosGerais />
			{/* <PublicacoesCarousel /> */}
			<RealizacaoApoio />
		</main>
	);
}
