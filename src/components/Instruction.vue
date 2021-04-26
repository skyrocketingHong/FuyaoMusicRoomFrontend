<template>
  <div>
    <mu-drawer width="300">
      <mu-card style="width: 100%; max-width: 375px; margin: 0 auto">
        <mu-card-header title="使用教程">
          <mu-avatar size="45" slot="avatar">
            <img
              style="border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2)"
              src="../assets/images/logo.png"
            />
          </mu-avatar>
        </mu-card-header>
      </mu-card>
      <mu-card-title title="用户" sub-title="以下命令在聊天框输入"></mu-card-title>
      <mu-card-text>
        <p>
          1.输入 “点歌 歌名” 即可点歌。例如：点歌 春夏秋冬，支持输入网易云音乐 ID 点歌。
        </p>
        <br />
        <p>
          2.没有想要点的音乐？ 请点击--> “
          <span
            @click="
              openManual = !openManual;
              openSearch = !openSearch;
            "
            style="cursor: pointer; color: #009688"
          >
            [点歌]
          </span>
          “，如果知道歌单id，还可以在歌曲窗口直接加*搜索：
          <span style="color: #009688">*歌单id</span>
          <br />
        </p>
        <br />
        <p>
          3.不知道歌单id?,请点击-->
          <span
            @click="
              openManual = !openManual;
              openSearchGd = !openSearchGd;
            "
            style="cursor: pointer; color: #009688"
          >
            [歌单]
          </span>
          提示：歌单页面可以搜索网易歌单、网易用户id的歌单、qq歌单、qq用户id的歌单
        </p>
        <br />

        <p>
          4.如点错歌曲可以输入 “
          <span style="color: #009688">删除音乐 歌名</span>
          ” 即可删除歌曲，管理员可以使用歌曲id删除。
        </p>
        <br />
        <p>
          5.如遇不好听的歌可以输入 “
          <span style="color: #009688">投票切歌</span>
          ” 或者点击 “
          <span @click="musicSkipVote" style="cursor: pointer; color: #009688">
            [切歌]
          </span>
          ”，默认当投票人数大于在线人数 30% 时将会切歌。管理员可以设置切歌率。
        </p>
        <br />
        <p>
          6.输入 “
          <span style="color: #009688">设置昵称 名字</span>
          ” 可以设置自己的显示昵称，仅限当前客户端有效。
        </p>
        <br />
        <p>
          7.私聊：输入 “
          <span style="color: #009688">@用户id 内容</span>
          ” 可以私聊相应用户，用户id即用户ip后面那一串字母，如ju2etxv2。
          不知道用户id,试着点击在线人数图标。
        </p>
        <br />

        <p>
          8.想要斗图？ ┏ (゜ω゜)=☞ “
          <span
            @click="
              openManual = !openManual;
              openPictureSearch = !openPictureSearch;
            "
            style="cursor: pointer; color: #009688"
          >
            [斗图]
          </span>
          ”
        </p>
        <br />
        <p>
          9.倒计时退出房间 输入 “
          <span style="color: #009688">倒计时退出 1</span>
          ” 则将在1分钟后退出房间。取消倒计时退出：
          <span style="color: #009688">取消退出</span>
          ”
        </p>
        <br />
        <p>
          10.如果有什么好的想法、建议或问题可以单项向管理员发送消息，（＾∀＾●）ﾉｼ “
          <span style="color: #009688">@管理员 内容</span>
          ”, 空格隔开哦!
        </p>
        <br />
      </mu-card-text>

      <mu-divider></mu-divider>
      <mu-card-title title="管理员" sub-title="以下命令在聊天框输入"></mu-card-title>
      <mu-card-text>
        <p>
          1.登录： “
          <span style="color: #009688">admin 123456</span>
          ” 。
        </p>
        <br />
        <p>
          2.修改密码： “
          <span style="color: #009688">修改密码 654321</span>
          ” 。
        </p>
        <br />
        <p>
          3.管理员公告 “
          <span style="color: #009688">公告 请文明聊天</span>
          ”。
        </p>
        <br />
        <p>
          4.点赞模式（歌曲列表按点赞数排序）： “
          <span style="color: #009688">点赞模式</span>
          ” 退出则“
          <span style="color: #009688">退出点赞模式</span>
          ” 。
        </p>
        <br />
        <p>
          5.随机模式（歌曲列表随机播放）： “
          <span style="color: #009688">随机模式</span>
          ” 退出则“
          <span style="color: #009688">退出随机模式</span>
          ” 。
        </p>
        <br />
        <p>
          6.修改投票切歌率： “
          <span style="color: #009688">投票切歌率 1</span>
          ” 数值在(0,1]。如：设置成0.5则表示房间人数一半赞同即可切歌。
        </p>
        <br />
        <p>
          7.禁止切歌：“
          <span style="color: #009688">禁止切歌</span>
          ” 启用则“
          <span style="color: #009688">启用切歌</span>
          ” 。
        </p>
        <br />
        <p>
          8.禁止点歌：“
          <span style="color: #009688">禁止点歌</span>
          ” 启用则“
          <span style="color: #009688">启用点歌</span>
          ” 。
        </p>
        <br />
        <p>
          9.清空列表：“
          <span style="color: #009688">清空列表</span>
          ” 。
        </p>
        <br />
        <p>
          10.清空默认播放列表：“
          <span style="color: #009688">清空默认列表</span>
          ” 。
        </p>
        <br />
        <p>
          11.设置默认播放列表（当点歌列表为空时，默认从此加载歌曲）：“
          <span style="color: #009688">设置默认列表 24381616,1</span>
          ” ，其中243881616和1是歌单id
        </p>
        <br />
        <p>
          12.默认列表歌曲数：“
          <span style="color: #009688">默认列表歌曲数</span>
          ” 。
        </p>
        <br />
        <p>
          13.置顶音乐： “
          <span style="color: #009688">置顶音乐 音乐id</span>
          ” 音乐id即歌曲列表中歌曲后面那一串字母，如411214279。
        </p>
        <br />
        <p>
          14.拉黑音乐：“
          <span style="color: #009688">拉黑音乐 音乐id</span>
          ” 漂白则“
          <span style="color: #009688">漂白音乐 音乐id</span>
          ” 。
        </p>
        <br />
        <p>
          15.音乐黑名单： “
          <span style="color: #009688">音乐黑名单</span>
          ” 。
        </p>
        <br />
        <p>
          16.拉黑用户：“
          <span style="color: #009688">拉黑用户 用户id</span>
          ” 漂白则“
          <span style="color: #009688">漂白用户 用户id</span>
          ” 用户id即用户ip后面那一串字母，如ju2etxv2。
        </p>
        <br />
        <p>
          17.用户黑名单： “
          <span style="color: #009688">用户黑名单</span>
          ” 。
        </p>
        <br />
        <p>
          18.设置点歌人：“
          <span style="color: #009688">设置点歌人 用户id</span>
          ” 用户id即用户ip后面那一串字母，如ju2etxv2。取消则“
          <span style="color: #009688">取消点歌人 用户id</span>
          ” 。
        </p>
        <br />
        <p>
          19.设置切歌人：“
          <span style="color: #009688">设置切歌人 用户id</span>
          ” 用户id即用户ip后面那一串字母，如ju2etxv2。取消则“
          <span style="color: #009688">取消切歌人 用户id</span>
          ” 。
        </p>
        <br />
      </mu-card-text>
    </mu-drawer>
  </div>
</template>
