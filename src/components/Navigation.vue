<template>
  <div>
    <mu-appbar style="width: 100%; position: fixed; right: 0; top: 0" color="primary" z-depth="1">
      <mu-button icon slot="left" @click="isOpenDrawer = !isOpenDrawer">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      {{ musichouse }}
      <mu-button slot="right" flat @click="handleClick" @show="musichouse == null">📲</mu-button>
      <mu-button slot="right" flat href="/">❌</mu-button>
    </mu-appbar>
    <mu-drawer
      width="300"
      :open.sync="isOpenDrawer"
      :docked="false"
      :right="false"
    >
      <mu-card style="width: 100%; max-width: 375px; margin: 0 auto">
        <mu-card-header title="扶摇 musicroom" sub-title="skyrocketing Hong">
          <mu-avatar size="45" slot="avatar">
            <img
              style="
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.2);
              "
              src="../assets/images/uicon.jpg"
            />
          </mu-avatar>
        </mu-card-header>
        <mu-card-media
          title="一起来听歌摸🐟吧！"
          style="max-height: 200px; overflow: hidden"
        >
          <img src="https://bing.creepersan.com/api/v1/img-current" />
        </mu-card-media>
        <mu-card-text>聊天 斗图 音乐</mu-card-text>
      </mu-card>
      <mu-list>
        <mu-sub-header>社交</mu-sub-header>
        <mu-list-item button target="_blank" href="https://skyrocketing.ninja/">
          <mu-list-item-title>博客</mu-list-item-title>
        </mu-list-item>
        <mu-divider></mu-divider>
        <mu-sub-header>开源</mu-sub-header>
        <mu-list-item
          button
          target="_blank"
          href="https://github.com/skyrocketingHong"
        >
          <mu-list-item-title>GitHub</mu-list-item-title>
        </mu-list-item>
      </mu-list>
      <mu-divider></mu-divider>
      <mu-sub-header>赞赏</mu-sub-header>
      <mu-card-media style="overflow: hidden">
        <img src="../assets/images/aplause.jpg" />
      </mu-card-media>
    </mu-drawer>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  props: {
    musichouse: String,
  },
  data: () => ({
    isOpenDrawer: false,
  }),
  methods: {
    handleClick() {
      this.$emit("openShareDialog", true);
    },
  },
};
</script>

<style scoped></style>
