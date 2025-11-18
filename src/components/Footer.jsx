"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import {Phone, Mail, MessageCircle} from "lucide-react";

const Footer = () => {
	return (
		<footer className='bg-neutral-900 text-neutral-100 border-t border-neutral-700 pt-10'>
			{/* Container principal */}
			<div className='container mx-auto px-6 max-w-7xl'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
					{/* ======= MAPA DO SITE ======= */}
					<motion.section
						initial={{opacity: 0, y: 20}}
						whileInView={{opacity: 1, y: 0}}
						transition={{duration: 0.5}}
						className='order-2 md:order-1'
					>
						<h3 className='text-lg font-semibold mb-3'>Mapa do site</h3>

						<ul className='list-disc pl-5 marker:text-cyan-500 space-y-1.5'>
							<li>
								<a
									href='/'
									className='hover:underline'
								>
									Home
								</a>
							</li>

							<li>
								<span>Sobre a Plataforma</span>
								<ul className='list-square pl-6 space-y-1 marker:text-cyan-500'>
									<li>
										<a
											href='/sobre#wanderlino-nogueira'
											className='hover:underline text-neutral-300'
										>
											Wanderlino Nogueira
										</a>
									</li>
								</ul>
							</li>

							<li>
								<span>Comitê da Criança</span>
								<ul className='list-square pl-6 space-y-1 marker:text-cyan-500'>
									<li>
										<a
											href='/comite#comentarios-gerais'
											className='hover:underline text-neutral-300'
										>
											Comentários Gerais
										</a>
									</li>
								</ul>
							</li>

							<li>
								<span>Relatórios</span>
								<ul className='list-square pl-6 space-y-1 marker:text-cyan-500'>
									<li>
										<a
											href='/relatorios#sociedade-civil'
											className='hover:underline text-neutral-300'
										>
											Sociedade Civil
										</a>
									</li>
									<li>
										<a
											href='/relatorios#estado-brasileiro'
											className='hover:underline text-neutral-300'
										>
											Estado Brasileiro
										</a>
									</li>
								</ul>
							</li>

							<li>
								<a
									href='/recomendacoes'
									className='hover:underline'
								>
									Recomendações
								</a>
							</li>
							<li>
								<a
									href='/jurisprudencia'
									className='hover:underline'
								>
									Jurisprudência
								</a>
							</li>
							<li>
								<a
									href='/acervo'
									className='hover:underline'
								>
									Acervo
								</a>
							</li>
						</ul>
					</motion.section>

					{/* ======= CONTATO ======= */}
					<motion.section
						initial={{opacity: 0, y: 20}}
						whileInView={{opacity: 1, y: 0}}
						transition={{duration: 0.5, delay: 0.2}}
						className='order-1 md:order-2'
					>
						<h3 className='text-lg font-semibold mb-3'>Contato</h3>

						<p className='font-semibold mb-3'>Plataforma Monitora CRC</p>

						<ul className='space-y-2'>
							<li className='flex items-center gap-2'>
								<Phone className='w-4 h-4 text-cyan-500 flex-shrink-0' />
								<a
									href='tel:+552130914666'
									className='hover:underline'
								>
									(21) 3091-4666
								</a>
							</li>

							<li className='flex items-center gap-2'>
								<MessageCircle className='w-4 h-4 text-cyan-500 flex-shrink-0' />
								<a
									href='https://wa.me/5521964998319'
									target='_blank'
									rel='noreferrer'
									className='hover:underline'
								>
									(21) 96499-8319
								</a>
							</li>

							<li className='flex items-center gap-2'>
								<Mail className='w-4 h-4 text-cyan-500 flex-shrink-0' />
								<a
									href='mailto:contato@monitoracrc.org.br'
									className='hover:underline'
								>
									contato@monitoracrc.org.br
								</a>
							</li>
						</ul>

						<ul className='mt-4 space-y-1.5'>
							<li>
								<a
									href='/termos'
									className='hover:underline text-neutral-300'
								>
									Termos e Condições de Uso
								</a>
							</li>
							<li>
								<a
									href='/privacidade'
									className='hover:underline text-neutral-300'
								>
									Política de Privacidade
								</a>
							</li>
						</ul>
					</motion.section>
				</div>
			</div>

			{/* ======= LOGO FINAL ======= */}
			<motion.div
				initial={{opacity: 0}}
				whileInView={{opacity: 1}}
				transition={{duration: 0.6}}
				className='container mx-auto px-6 max-w-7xl flex justify-center items-center py-8'
			>
				<div className='flex flex-col items-center'>
					<div className='relative w-40 h-12 md:w-48 md:h-14 mb-2'>
						<Image
							src='/images/logo_cedeca_white.png'
							alt='Logo Monitora CRC'
							fill
							className='object-contain'
							sizes='(max-width: 768px) 160px, 200px'
							priority
						/>
					</div>
					
				</div>
			</motion.div>

			{/* ======= COPYRIGHT ======= */}
			<div className='border-t border-neutral-700 bg-neutral-800'>
				<div className='container mx-auto px-6 max-w-7xl text-center py-4'>
					<p className='text-neutral-400 text-sm'>
						© 2025 Monitora CRC — Todos os direitos reservados | Desenvolvido
						por{" "}
						<a
							href='https://megacriativa.com'
							target='_blank'
							rel='noreferrer'
							className='text-cyan-500 hover:underline'
						>
							Mega Criativa Tecnologia
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
