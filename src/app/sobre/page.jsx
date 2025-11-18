export const metadata = {
	title: "Sobre a Plataforma | Monitora CRC",
};

export default function SobrePage() {
	return (
		<section className='container mx-auto px-6 py-16 max-w-4xl'>
			<h1 className='text-3xl font-bold text-cyan-600 mb-6'>
				Sobre a Plataforma
			</h1>
			<p className='text-neutral-700 leading-relaxed mb-4'>
				A Plataforma Monitora CRC foi criada para promover o acompanhamento
				sistemático da implementação da Convenção sobre os Direitos da Criança
				no Brasil.
			</p>
			<p className='text-neutral-700 leading-relaxed'>
				Ela integra relatórios, recomendações e informações relevantes,
				fortalecendo a transparência e o diálogo entre sociedade civil e
				governo.
			</p>
		</section>
	);
}
