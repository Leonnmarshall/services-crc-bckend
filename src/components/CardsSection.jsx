"use client";
import {motion} from "framer-motion";
import iconPlaceholder from "/public/images/logo-mobile.png";

const cardsData = [
	{
		title: "Recomendações do Comitê dos Direitos da Criança (CRC)",
		text: "Acesse as orientações específicas que o Comitê da ONU (CRC) dirige aos países...",
	},
	{
		title: "Relatórios do Brasil",
		text: "Acesse os relatórios oficiais do Brasil relacionados à Convenção...",
	},
	{
		title: "Comentários Gerais",
		text: "Entenda as interpretações aprofundadas do Comitê (CRC)...",
	},
	{
		title: "Homenagem a Wanderlino Nogueira Neto",
		text: "Dedicamos um espaço especial para reconhecer o legado desta figura fundamental...",
	},
	{
		title: "Jurisprudência do Comitê",
		text: "Mergulhe nas decisões e pareceres do Comitê da ONU (CRC)...",
	},
	{
		title: "Acervo",
		text: "Além desses pilares, nossa plataforma oferece um acervo diversificado...",
	},
];

export default function CardsSection() {
	return (
		<section className='container mx-auto px-6'>
			<div className='text-center mb-10'>
				<h2>O Que Você Encontra na Monitora CRC?</h2>
				<p className='max-w-2xl mx-auto'>
					Organizado para facilitar sua pesquisa e compreensão dos direitos da
					infância.
				</p>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
				{cardsData.map((card, index) => (
					<motion.div
						key={index}
						whileHover={{scale: 1.03}}
						className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center'
					>
						<img
							src={iconPlaceholder}
							alt='Ícone'
							className='w-16 mx-auto mb-4 opacity-80'
						/>
						<h3 className='text-lg font-semibold mb-2 text-blue-900'>
							{card.title}
						</h3>
						<p className='text-gray-600'>{card.text}</p>
					</motion.div>
				))}
			</div>
		</section>
	);
}
