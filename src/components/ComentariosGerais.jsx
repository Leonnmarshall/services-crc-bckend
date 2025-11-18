"use client";
import {motion} from "framer-motion";

export default function ComentariosGerais() {
	return (
		<section className='container mx-auto px-6 text-center'>
			<h2>Comentários Gerais</h2>
			<motion.p
				initial={{opacity: 0, y: 20}}
				whileInView={{opacity: 1, y: 0}}
				transition={{duration: 0.7}}
				className='max-w-3xl mx-auto'
			>
				Os Comentários Gerais do Comitê dos Direitos da Criança são
				interpretações aprofundadas sobre temas essenciais da Convenção,
				servindo como guias para governos, organizações e sociedade civil.
			</motion.p>
		</section>
	);
}
