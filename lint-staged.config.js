const config = {
  "*.{js,ts,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.astro": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"],
};

export default config;
