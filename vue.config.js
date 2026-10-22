/*
 * ============================================================
 * Quiz 后台管理系统 — 构建配置
 * ============================================================
 * publicPath 使用相对路径，保证 dist/index.html 直接双击也能打开；
 * 路由采用 hash 模式，部署到 Vercel 无需额外的 rewrite 配置。
 * ============================================================
 */
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: false
  }
}
