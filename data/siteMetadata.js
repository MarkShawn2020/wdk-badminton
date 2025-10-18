/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: '五道口AI创业羽毛球俱乐部 | Wudaokou AI Badminton Club',
  author: 'WDK Badminton Club',
  headerTitle: '五道口羽毛球 🏸',
  description:
    '连接五道口AI创业者的羽毛球社区。参与活动、提升技术、结识同行。Join Wudaokou AI entrepreneurs for badminton, networking, and fun.',
  language: 'zh-cn',
  theme: 'light', // system, dark or light
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://wdk-badminton.com',
  siteRepo: 'https://github.com/markshawn2020/wdk-badminton',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.svg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/og-badminton.png`,
  email: 'contact@wdk-badminton.com',
  wechat: 'WDK_Badminton', // 微信公众号
  github: 'https://github.com/markshawn2020/wdk-badminton',
  locale: 'zh-CN',
  // set to true if you want a navbar fixed to the top
  stickyNav: true, // 羽毛球俱乐部需要固定导航，方便快速访问
  analytics: {
    // 国内部署建议使用百度统计或友盟
    // umamiAnalytics: {
    //   umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    // },
    // 或者使用Google Analytics（如果面向海外用户）
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // 暂时不需要newsletter，Phase 2可以添加微信订阅
    provider: '',
  },
  comments: {
    // Phase 1不需要评论，Phase 2可以添加
    provider: '', // 可选：giscus, utterances, disqus
  },
  search: {
    provider: 'kbar', // 保留快捷搜索功能
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
