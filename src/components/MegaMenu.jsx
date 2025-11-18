"use client";
import {useState} from "react";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";
import {Menu, X, ChevronDown} from "lucide-react";

export default function MegaMenu() {
	const [activeMenu, setActiveMenu] = useState(null);
	const [mobileOpen, setMobileOpen] = useState(false);

	const menuItems = [
		{
			title: "Sobre",
			href: "/#sobre",
			columns: [
				{
					heading: "A Plataforma",
					links: [
						{name: "O que é", href: "/#sobre"},
						{name: "Objetivos", href: "/#objetivos"},
						{name: "Como funciona", href: "/#funcionamento"},
					],
				},
				{
					heading: "Equipe e Parceiros",
					links: [
						{name: "Comitê da Criança", href: "/#comite"},
						{name: "Instituições", href: "/#instituicoes"},
					],
				},
			],
		},
		{
			title: "Publicações",
			href: "/#publicacoes",
			columns: [
				{
					heading: "Relatórios e Dados",
					links: [
						{name: "Relatórios Anuais", href: "/#relatorios"},
						{name: "Estudos e Pesquisas", href: "/#pesquisas"},
					],
				},
				{
					heading: "Materiais e Cartilhas",
					links: [
						{name: "Downloads", href: "/#downloads"},
						{name: "Guia de Boas Práticas", href: "/#guias"},
					],
				},
			],
		},
		{
			title: "Notícias",
			href: "/#noticias",
			columns: [
				{
					heading: "Atualizações",
					links: [
						{name: "Últimas notícias", href: "/#noticias"},
						{name: "Eventos", href: "/#eventos"},
					],
				},
			],
		},
		{
			title: "Contato",
			href: "/#contato",
			columns: [
				{
					heading: "Fale Conosco",
					links: [
						{name: "Formulário", href: "/#contato"},
						{name: "Localização", href: "/#mapa"},
					],
				},
			],
		},
	];

	return (
		<header className='bg-white flex shadow-sm fixed top-0 left-0 w-full z-50'>
			<div className='max-w-xl mx-auto flex items-center px-6 py-4'>
				{/* Logo */}
				<Link
					href='/'
					className='flex items-center space-x-2'
				>
					<img
						src='/images/logo.png'
						alt='Logo'
						className='h-10 w-auto'
					/>
				</Link>
			</div>
			<div className='max-w-xl mx-auto flex items-center justify-between px-6 py-4'>
				{/* ---- LOGIN ---- */}
				<Link
					href='/login'
					className='px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-800 transition-colors'
				>
					ENTRAR
				</Link>

				{/* ---- CADASTRO ---- */}
				<Link
					href='/cadastro'
					className='px-4 py-2 rounded-md bg-[#5ea6e0] text-black font-semibold hover:bg-[#7bbcee] transition-colors'
				>
					CADASTRAR
				</Link>
				{/* Menu Desktop */}

				{/* Mobile Menu Button */}
				<button
					className='md:hidden p-2 text-gray-800'
					onClick={() => setMobileOpen(!mobileOpen)}
				>
					{mobileOpen ? (
						<X className='w-6 h-6' />
					) : (
						<Menu className='w-6 h-6' />
					)}
				</button>
			</div>

			{/* Mobile Drawer */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						initial={{x: "100%"}}
						animate={{x: 0}}
						exit={{x: "100%"}}
						transition={{type: "spring", stiffness: 200, damping: 25}}
						className='fixed inset-0 bg-white z-40 flex flex-col p-6 space-y-4 md:hidden shadow-lg overflow-y-auto'
					>
						{menuItems.map((item) => (
							<div key={item.title}>
								<details className='group'>
									<summary className='flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 py-2'>
										{item.title}
										<ChevronDown className='w-4 h-4 group-open:rotate-180 transition-transform' />
									</summary>
									<div className='pl-4 mt-2 space-y-3'>
										{item.columns.map((col, idx) => (
											<div key={idx}>
												<h4 className='text-sm font-semibold text-gray-700'>
													{col.heading}
												</h4>
												<ul className='space-y-1'>
													{col.links.map((link) => (
														<li key={link.name}>
															<Link
																href={link.href}
																onClick={() => setMobileOpen(false)}
																className='block text-gray-600 hover:text-blue-600 transition'
															>
																{link.name}
															</Link>
														</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</details>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
