"use client";

import {useState} from "react";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";

const NAV_LINKS = [
	{label: "HOME", path: "/HomePage"},
	{label: "SOBRE A PLATAFORMA", path: "/sobre"},
	{label: "COMITÊ DA CRIANÇA", path: "/comite"},
	{label: "RELATÓRIOS", path: "/relatorios"},
	{label: "RECOMENDAÇÕES", path: "/recomendacoes"},
	{label: "JURISPRUDÊNCIA", path: "/jurisprudencia"},
	{label: "ACERVO", path: "/acervo"},
	{ label: "FALE CONOSCO", path: "/fale-conosco" },
	/* { label: "Login", path: "/login" },
	{ label: "Cadastro", path: "/cadastro" }, */
];

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className='w-full font-sans relative top-0 left-0 z-50'>
			{/* ====== TOPO BRANCO ====== */}
			<div className='bg-white border-b border-gray-200 py-3 px-6 md:px-12 flex justify-center items-center'>
				<div className='w-full max-w-[1400px] flex items-center justify-between'>
					{/* LOGO */}
					<Link
						href='/'
						aria-label='Voltar para a página inicial'
						className='flex items-center'
					>
						<div
							className='hidden md:inline-block w-[155px] h-[65px] bg-contain bg-left bg-no-repeat'
							style={{backgroundImage: "url(/images/logo-desktop.png)"}}
						/>
						<div
							className='md:hidden inline-block w-[45px] h-[45px] bg-contain bg-center bg-no-repeat'
							style={{backgroundImage: "url(/images/logo-mobile.png)"}}
						/>
					</Link>

					{/* TÍTULO CENTRAL */}
					<h1 className='text-[1.6rem] md:text-[1.4rem] font-semibold text-[#0f3557] uppercase tracking-wide text-center flex-1 mx-4'>
						CONVENÇÃO SOBRE OS DIREITOS DA CRIANÇA
					</h1>

					<div className='w-[160px]' />
				</div>
			</div>

			{/* ====== BARRA PRETA ====== */}
			<div className='bg-[#1c1c1c] border-b border-[#444] h-[70px] flex justify-center items-center w-full'>
				<div className='flex justify-between items-center w-full max-w-[1400px] px-6 md:px-12'>
					{/* ÍCONE MOBILE */}
					<button
						className='text-white text-2xl md:hidden focus:outline-none z-[60]'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
					>
						☰
					</button>

					{/* MENU DESKTOP */}
					<nav className='hidden md:flex flex-wrap gap-8 justify-center items-center text-white text-[1rem] font-medium tracking-wide'>
						{NAV_LINKS.map((item) => (
							<Link
								key={item.label}
								href={item.path}
								className='transition-colors hover:text-[#5ea6e0]'
							>
								{item.label}
							</Link>
						))}

					
					</nav>
				</div>
			</div>

			{/* ====== MENU MOBILE (LATERAL) ====== */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.nav
						initial={{x: "-100%"}}
						animate={{x: 0}}
						exit={{x: "-100%"}}
						transition={{duration: 0.3}}
						className='fixed top-0 left-0 w-[75%] h-full bg-[#111] z-50 py-24 px-6 shadow-lg'
					>
						<ul className='flex flex-col gap-6'>
							{NAV_LINKS.map((item) => (
								<li key={item.label}>
									<Link
										href={item.path}
										onClick={() => setIsMenuOpen(false)}
										className='block text-white text-lg font-medium hover:text-[#5ea6e0] transition-colors'
									>
										{item.label}
									</Link>
								</li>
							))}

							{/* ---- LOGIN MOBILE ---- */}
							<li>
								<Link
									href='/login'
									onClick={() => setIsMenuOpen(false)}
									className='block text-white text-lg font-semibold bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors'
								>
									ENTRAR
								</Link>
							</li>

							{/* ---- CADASTRO MOBILE ---- */}
							<li>
								<Link
									href='/cadastro'
									onClick={() => setIsMenuOpen(false)}
									className='block text-black text-lg font-semibold bg-[#5ea6e0] px-4 py-2 rounded-md hover:bg-[#7bbcee] transition-colors'
								>
									CADASTRAR
								</Link>
							</li>
						</ul>
					</motion.nav>
				)}
			</AnimatePresence>

			{/* BACKDROP */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{opacity: 0}}
						animate={{opacity: 0.6}}
						exit={{opacity: 0}}
						transition={{duration: 0.2}}
						onClick={() => setIsMenuOpen(false)}
						className='fixed inset-0 bg-black z-40'
					/>
				)}
			</AnimatePresence>
		</header>
	);
}
