import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Impostore",
  base: '/impostore/',
  description: "A VitePress Site",
  head: [
    ['link', { rel: 'icon', href: '/icon-head.png' }]
  ],
  vite: {
    css: {
      postcss: './postcss.config.js'
    }
  },
  appearance: 'dark',
  themeConfig: {
    footer: {
      message: 'Gentilmente offerto da Alessandro Schiavo',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Create Party', link: '/create-party' },
      { text: 'Unisciti alla partita', link: '/view-word' },
    ],

    sidebar: [
      {
        text: '',
        items: [
          { text: 'Create Party', link: '/create-party' },
          { text: 'Unisciti alla partita', link: '/view-word' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ares-17' }
    ]
  }
})
