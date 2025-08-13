import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({url}) => {
	const defaultSeo = {
		title: 'Frizetto | Programări Online',
		description: 'Cea mai bună frizerie din Băilești. Programează-te online rapid și ușor.',
		ogImage: `${url?.origin}/images/auth.webp`
	};

	return { seo: defaultSeo };
};
