export const metadata = {
	title: "Relatórios | Monitora CRC",
};

export default function RelatoriosPage() {
	return (
		<section className='container mx-auto px-6 py-16 max-w-5xl'>
			<h1 className='text-3xl font-bold text-cyan-600 mb-6'>Relatórios</h1>
			<p className='text-neutral-700 leading-relaxed mb-4'>
				Aqui estão disponíveis relatórios da sociedade civil e do Estado
				brasileiro, relacionados à implementação dos direitos da criança e do
				adolescente.
			</p>
			<div className='mt-8 grid gap-6 md:grid-cols-2'>
				<div className='p-5 bg-white shadow rounded-lg border border-neutral-200'>
					<h3 className='text-lg font-semibold text-cyan-700 mb-2'>
						Relatórios da Sociedade Civil
					</h3>
					<p className='text-sm text-neutral-600'>
						Análises independentes e participativas.
					</p>
				</div>
				<div className='p-5 bg-white shadow rounded-lg border border-neutral-200'>
					<h3 className='text-lg font-semibold text-cyan-700 mb-2'>
						Relatórios do Estado Brasileiro
					</h3>
					<p className='text-sm text-neutral-600'>
						Prestação de contas oficial do governo.
					</p>
				</div>
			</div>
		</section>
	);
}
