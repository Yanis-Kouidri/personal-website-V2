const config = {
	"*.{js,ts,astro,mjs,cjs,json,md}": [
		"bun biome check --write --no-errors-on-unmatched",
	],
};

export default config;
