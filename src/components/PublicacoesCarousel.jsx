"use client";

import {useEffect} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination, Autoplay} from "swiper/modules";
import {motion} from "framer-motion";

// ✅ Importações CSS via dynamic import no client
if (typeof window !== "undefined") {
	import("swiper/css");
	import("swiper/css/navigation");
	import("swiper/css/pagination");
}

const publicacoes = [
	{
		id: 1,
		titulo: "Relatório Anual 2024",
		descricao:
			"Veja os principais indicadores e resultados das ações do CEDECA durante o último ano.",
		imagem: "/img/relatorio.jpg",
	},
	{
		id: 2,
		titulo: "Campanha Infância Protegida",
		descricao:
			"Uma iniciativa que mobiliza escolas e famílias pela proteção integral da criança e do adolescente.",
		imagem: "/img/campanha.jpg",
	},
	{
		id: 3,
		titulo: "Guia de Direitos 2025",
		descricao:
			"Novo guia informativo sobre os direitos fundamentais de crianças e adolescentes.",
		imagem: "/img/guia.jpg",
	},
];

export default function PublicacoesCarousel() {
	useEffect(() => {
		// Apenas para garantir que os estilos do Swiper carreguem no client
	}, []);

	return (
		<section className='py-16 bg-gradient-to-b from-blue-50 to-white'>
			<div className='max-w-6xl mx-auto px-6 text-center'>
				<motion.h2
					initial={{opacity: 0, y: -20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.6}}
					className='text-3xl font-bold text-blue-900 mb-10'
				>
					Publicações Recentes
				</motion.h2>

				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={20}
					slidesPerView={1}
					navigation
					pagination={{clickable: true}}
					autoplay={{delay: 4500, disableOnInteraction: false}}
					breakpoints={{
						640: {slidesPerView: 1},
						768: {slidesPerView: 2},
						1024: {slidesPerView: 3},
					}}
					className='pb-12'
				>
					{publicacoes.map((pub) => (
						<SwiperSlide key={pub.id}>
							<motion.div
								whileHover={{scale: 1.03}}
								className='bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all'
							>
								<img
									src={pub.imagem}
									alt={pub.titulo}
									className='w-full h-56 object-cover'
								/>
								<div className='p-6 text-left'>
									<h3 className='text-xl font-semibold text-blue-800 mb-2'>
										{pub.titulo}
									</h3>
									<p className='text-gray-600 text-sm'>{pub.descricao}</p>
								</div>
							</motion.div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}
