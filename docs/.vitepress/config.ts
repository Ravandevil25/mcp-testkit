import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'mcp-works',
  description: 'Mock, contract-test, validate and guard MCP tool servers.',
  base: '/mcp-works/',
  ignoreDeadLinks: [/^.\/LICENSE$/],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'API', link: '/api/README' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'npm', link: 'https://www.npmjs.com/package/mcp-works' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Vitest Guide', link: '/guides/vitest' },
          { text: 'Jest / Node Guide', link: '/guides/jest-node' },
          { text: 'CI Guide', link: '/guides/ci' },
          { text: 'SDK Compat', link: '/guides/sdk-compat' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api/README' },
          { text: 'Migration', link: '/migration' },
          { text: 'FAQ', link: '/faq' },
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Ravandevil25/mcp-works' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/mcp-works' },
    ],
    editLink: {
      pattern: 'https://github.com/Ravandevil25/mcp-works/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    search: { provider: 'local' },
  },
});
