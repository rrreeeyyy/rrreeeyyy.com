import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../config';
import { getCollection } from 'astro:content'

export const get = async () => {
	const posts = (await getCollection("blog")).reverse();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			link: `/blog/${post.slug}`,
		})),
	});
}
