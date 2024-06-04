<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted() {
    // 关闭标签触发
    this.$Bus.$on('removeCache', (name, view) => {
   
      this.removeCache(name, view)
    })
    // 刷新标签触发
    this.$Bus.$on('removeRedirect', (name, view) => {
      this.removeRedirect(name, view)
    })
  },
  beforeDestroy() {
    this.$Bus.$off('removeCache')
    this.$Bus.$off('removeRedirect')
  },
  methods: {
    getVnode() {
      // 判断子集非空
      if (this.$children.length === 0) return false
      let vnode
      for (const item of this.$children) {
        // 如果data中有key则代表找到了keep-alive下面的子集，这个key就是router-view上的key
        if (item.$vnode.data.key) {
          vnode = item.$vnode
          break
        }
      }
      return vnode || false
    },
    removeRedirect(view = {}) {
      const viewNew = {
        fullPath: `/redirect${view.fullPath}`,
        path: `/redirect${view.path}`
      }
      this.removeCache('closeSelectedTag', viewNew)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }
}

.fixed-header + .app-main {
  padding-top: 84px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
