"use client";
import {motion} from "framer-motion";
import Image from "next/image";

export default function Banner() {
	return (
		<section className='relative bg-gradient-to-r from-blue-800 to-blue-600 text-white overflow-hidden'>
			<div className='container mx-auto px-6 py-24 text-center relative z-10'>
				<motion.h1
					initial={{opacity: 0, y: 40}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.8}}
					className='text-4xl md:text-6xl font-bold mb-6'
				>
					Plataforma Monitora CRC
				</motion.h1>
				<motion.p
					initial={{opacity: 0}}
					animate={{opacity: 1}}
					transition={{delay: 0.4}}
					className='max-w-3xl mx-auto text-lg md:text-xl'
				>
					Recomendações da ONU ao Brasil sobre os direitos da criança e do
					adolescente.
				</motion.p>
			</div>
			<Image
				src='/images/banner_home.jpg'
				alt='Banner'
				sizes='100vw, 100vh'
				width={1920}
				height={600}
				loading='lazy'
				className='absolute -z-10-99 inset-0 object-cover w-full h-full bg-cover bg-center bg-image'
			/>
			<div className="absolute inset-0 opacity-20 bg-[url('/images/banner_home.jpg')] bg-cover bg-center"></div>
		</section>
	);
}
