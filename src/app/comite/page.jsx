export const metadata = {
	title: "Comitê da Criança | Monitora CRC",
};

export default function ComitePage() {
	return (
		<section className='container mx-auto px-6 py-16 max-w-4xl'>
			<h1 className='text-3xl font-bold text-cyan-600 mb-6'>
				Comitê da Criança
			</h1>
			<p className='text-neutral-700 leading-relaxed mb-4'>
				O Comitê da Criança acompanha o cumprimento da Convenção sobre os
				Direitos da Criança, avaliando periodicamente os avanços e desafios no
				Brasil.
			</p>
			<p className='text-neutral-700 leading-relaxed'>
				Nesta seção, você encontra comentários gerais, relatórios e
				recomendações elaborados pelo Comitê.
			</p>
		</section>
	);
}
