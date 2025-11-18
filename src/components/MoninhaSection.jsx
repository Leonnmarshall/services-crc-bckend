"use client";
import {motion} from "framer-motion";
import moninha from "/public/images/moninha.svg";

export default function MoninhaSection() {
	return (
		<section className='bg-blue-100 py-16'>
			<div className='container mx-auto flex flex-col md:flex-row items-center gap-10 px-6'>
				<motion.img
					src={moninha}
					alt='Moninha mascote'
					className='w-60 mx-auto md:mx-0'
					initial={{opacity: 0, x: -50}}
					whileInView={{opacity: 1, x: 0}}
					transition={{duration: 0.6}}
				/>
				<div className='text-center md:text-left max-w-lg'>
					<h2>Conheça a Moninha</h2>
					<p>
						A mascote da plataforma simboliza a força e a esperança das crianças
						brasileiras. Ela representa o compromisso com um futuro mais justo e
						igualitário.
					</p>
				</div>
			</div>
		</section>
	);
}
