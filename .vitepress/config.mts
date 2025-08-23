import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Impostore",
  description: "A VitePress Site",
  head: [
    ['link', { rel: 'icon', href: '/public/icon-head.png' }]
  ],
  vite: {
    css: {
      postcss: './postcss.config.js'
    }
  },
  appearance: 'dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Create Party', link: '/create-party' },
      { text: 'Join Party', link: '/join-party' }
    ],

    sidebar: [
      {
        text: '',
        items: [
          { text: 'Create Party', link: '/create-party' },
          { text: 'Join Party', link: '/join-party' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
