import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    showBack?: boolean
    backTo?: string
    backLabel?: string
  }
}
