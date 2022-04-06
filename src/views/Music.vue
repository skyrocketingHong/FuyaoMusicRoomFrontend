<template>
  <div>
    <!-- 播放界面 -->
    <div v-if="isPlay">
      <navigation
        :musichouse="musichouse"
        @openShareDialog="openShare = !openShare"
      ></navigation>
      <mu-container class="demo-container" style="margin-top: 80px">
        <mu-row style="margin-bottom: 23px"></mu-row>
        <mu-row gutter>
          <!-- 左侧播放器 -->
          <mu-col span="12" sm="12" md="8" lg="8" xl="8">
            <mu-col span="12">
              <mu-row>
                <mu-col
                  span="12"
                  sm="12"
                  md="5"
                  lg="4"
                  xl="3"
                  style="text-align: center"
                  @click="playMusic"
                >
                  <mu-avatar
                    :size="albumRotateSize"
                    style="
                      border: 2px solid rgba(26, 26, 26, 0.5);
                      overflow: hidden;
                      box-shadow: inset 0 0 20px 2px #000;
                    "
                  >
                    <img
                      :class="albumRotate ? 'album album-rotate' : 'album'"
                      :src="
                        music.pictureUrl
                          ? music.pictureUrl
                          : require('../assets/images/logo.png')
                      "
                      :style="albumRotateStyle"
                      alt="pic"
                    />
                  </mu-avatar>
                  <mu-flex justify-content="center">
                    <mu-flex class="flex-demo" justify-content="start">
                      <mu-icon value="volume_up" color="primary"></mu-icon>
                    </mu-flex>
                    <mu-flex
                      class="flex-demo"
                      justify-content="start"
                      style="margin-left: 5px; margin-right: 10px"
                      fill
                    >
                      <mu-slider
                        class="demo-slider"
                        color="#fb8e00"
                        v-model="volume"
                      ></mu-slider>
                    </mu-flex>
                  </mu-flex>
                </mu-col>
                <mu-col span="12" sm="12" md="7" lg="8" xl="9">
                  <div
                    style="
                      font-size: 26px;
                      font-weight: 600;
                      margin: 4px 0 10px 25px;
                      min-height: 31px;
                    "
                  >
                    {{ music ? music.name : "" }}
                  </div>
                  <div style="display: flex">
                    <div
                      style="
                        font-size: 18px;
                        font-weight: 400;
                        margin: 0 auto 0 25px;
                        min-height: 21px;
                      "
                    >
                      <div style="font-size: 14px; color=gray">专辑</div>
                      {{ music.album ? music.album.name : "" }}
                      <div style="font-size: 14px; color=gray">歌手</div>
                      {{ music ? music.artist : "" }}
                      <div style="font-size: 14px; color=gray">来源</div>
                      {{
                        music.source === "Netease"
                          ? "网易云音乐"
                          : music.source === "QQMusic"
                          ? "QQ音乐"
                          : ""
                      }}
                    </div>
                  </div>
                  <small id="musicEndTime" style="float: right">
                    {{ playerTime }}
                  </small>
                  <mu-linear-progress
                    mode="determinate"
                    :value="progress"
                    color="#fb8e00"
                    style="margin-left: 5px"
                  ></mu-linear-progress>
                </mu-col>
              </mu-row>
            </mu-col>
            <div
              style="
                font-size: 20px;
                font-weight: 400;
                margin: 10px 0px 0px 20px;
                min-height: 21px;
                text-align: center;
                width: 90%;
                overflow: hide;
              "
            >
              <div style="font-size: 14px; color=gray">当前歌词</div>
              {{ lyric }}
            </div>
            <mu-col span="12">
              <mu-data-table
                style="
                  background-color: transparent;
                  max-height: 380px;
                  overflow: auto;
                "
                :selectable="false"
                :hover="false"
                :columns="columns"
                :data="pick"
              >
                <template slot-scope="scope">
                  <td class="is-left">
                    <a
                      @click="removeCollect(scope.row)"
                      v-if="
                        favoriteMap[scope.row.id] != null &&
                        favoriteMap[scope.row.id] != undefined
                      "
                    >
                      <mu-icon value="favorite" size="20" color="red"></mu-icon>
                    </a>
                    <a @click="collectMusic(scope.row)" v-else>
                      <mu-icon
                        value="favorite"
                        size="20"
                        color="white"
                      ></mu-icon>
                    </a>
                    {{ scope.$index + 1 }}
                  </td>
                  <td class="is-left">
                    <a
                      @click="goodMusic(scope.row)"
                      v-if="scope.$index != 0 && good"
                    >
                      <mu-icon
                        value="thumb_up"
                        size="20"
                        color="teal"
                      ></mu-icon>
                    </a>
                    {{
                      isRoot || isAdmin
                        ? scope.row.name + `[${scope.row.id}]`
                        : scope.row.name
                    }}
                  </td>
                  <td class="is-center">{{ scope.row.artist }}</td>
                  <td class="is-center">
                    {{ scope.row.album.name }}
                  </td>
                  <td class="is-center">
                    {{
                      isRoot || isAdmin
                        ? scope.row.nickName +
                          (scope.row.sessionId
                            ? `[${scope.row.sessionId}]`
                            : "")
                        : scope.row.nickName
                    }}
                  </td>
                </template>
              </mu-data-table>
            </mu-col>
          </mu-col>
          <!-- 右侧聊天框 -->
          <mu-col span="12" sm="12" md="4" lg="4" xl="4">
            <mu-col
              :style="
                screenWidth < 766 && screenWidth !== 0
                  ? 'margin: 60px 0 200px 0;'
                  : ''
              "
            >
              <mu-flex justify-content="center" style="margin-bottom: 10px">
                <mu-button
                  round
                  color="transparent"
                  @click="openHouse = !openHouse"
                >
                  <mu-icon left value="account_balance"></mu-icon>
                  查看所有房间
                </mu-button>
              </mu-flex>
              <mu-button flat color="white" @click="houseUser">
                <mu-icon left value="supervisor_account"></mu-icon>
                此房间在线 {{ online }} 人
              </mu-button>
              <mu-button
                flat
                color="white"
                @click="clearScr"
                style="float: right"
              >
                <mu-icon left value="clear_all"></mu-icon>
                清屏
              </mu-button>
              <div id="chat-container">
                <div
                  v-for="(item, index) in chatData"
                  :style="item.type === 'notice' ? 'text-align: center' : ''"
                  style="padding: 10px 0"
                >
                  <div>
                    <small class="chat-data-user">
                      {{
                        (isRoot || isAdmin) && item.type === "chat"
                          ? item.nickName + `[${item.sessionId}]`
                          : item.nickName
                      }}{{
                        item.sendTime
                          ? "  " + formatterFullTime(item.sendTime)
                          : ""
                      }}
                    </small>
                  </div>
                  <div v-if="item.type === 'notice'">
                    <span class="chat-data-notice">{{ item.content }}</span>
                  </div>
                  <div v-if="item.type === 'chat'" class="chat-data-content">
                    <span>{{ item.content }}</span>
                    <img
                      v-if="item.images.length > 0"
                      v-for="(img, index) in item.images"
                      :src="img"
                      alt
                      style="width: 100%; display: block"
                    />
                  </div>
                </div>
              </div>
              <div
                :class="
                  screenWidth < 766 && screenWidth !== 0
                    ? 'message-input-group'
                    : ''
                "
              >
                <div
                  style="display: flex; flex-direction: row; flex-wrap: nowrap"
                >
                  <mu-text-field
                    :value="chatMessage"
                    @input="updateChatMessage"
                    @keydown.enter="sendHandler"
                    placeholder="在此处输入消息"
                    color="white"
                    class="width-size-100 chat-message"
                  ></mu-text-field>
                  <mu-flex class="flex-wrapper" align-items="center">
                    <mu-button
                      v-if="!isContented"
                      @click="connect"
                      color="primary"
                      style="width: 90%"
                    >
                      连接服务器
                    </mu-button>
                    <mu-button
                      v-if="isContented"
                      @click="sendHandler"
                      color="primary"
                      style="width: 90%"
                    >
                      发送消息
                    </mu-button>
                  </mu-flex>
                </div>
                <div
                  style="
                    color: white;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-around;
                    align-items: center;
                  "
                >
                  <mu-radio
                    :value="'Netease'"
                    v-model="sourceChat"
                    color="primary"
                    :label="'从网易云音乐点歌'"
                    class="searchSource"
                  ></mu-radio>
                  <mu-radio
                    :value="'qq'"
                    v-model="sourceChat"
                    color="primary"
                    :label="'从QQ音乐点歌'"
                    class="searchSource"
                  ></mu-radio>
                </div>
                <div
                  style="
                    padding-top: 10px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 10px;
                  "
                >
                  <mu-button
                    style="margin-right: 3px; min-width: 10%"
                    color="secondary"
                    @click="openPictureSearch = !openPictureSearch"
                  >
                    斗图
                  </mu-button>
                  <mu-button
                    style="margin-right: 3px; min-width: 10%"
                    color="secondary"
                    @click="musicSkipVote"
                  >
                    切歌
                  </mu-button>
                  <mu-button
                    style="margin-right: 3px; min-width: 10%"
                    color="secondary"
                    @click="openSearch = !openSearch"
                  >
                    搜歌
                  </mu-button>
                  <mu-button
                    style="margin-right: 3px; min-width: 10%"
                    color="secondary"
                    @click="searchTop"
                  >
                    热榜
                  </mu-button>
                  <mu-button
                    style="margin-right: 3px; min-width: 10%"
                    color="secondary"
                    @click="openManual = !openManual"
                  >
                    教程
                  </mu-button>
                  <mu-button icon @click="openBotttomSheet">
                    <mu-icon value="favorite" color="red"></mu-icon>
                  </mu-button>
                </div>
              </div>
            </mu-col>
          </mu-col>
        </mu-row>
      </mu-container>
      <div id="blur" style="opacity: 0.4">
        <img :src="music.pictureUrl" alt="blur-img" />
      </div>
      <div>
        <audio
          id="music"
          :src="music.url"
          @timeupdate="musicTimeUpdate"
          controls
          autoplay="autoplay"
          @canplaythrough="nextSong"
          @canplay="setCurrentTime"
          style="display: none"
        ></audio>
        <audio id="music2" :src="music2.url" style="display: none"></audio>
      </div>
    </div>
    <!-- 首页 -->
    <div id="play" v-if="!isPlay" :style="backgroundDiv">
      <mu-appbar style="width: 100%; position: fixed" color="primary">
        扶摇 musicroom
      </mu-appbar>
      <!-- 房间列表与新建房间 -->
      <div
        style="
          display: flex;
          clear: both;
          flex-direction: row;
          justify-content: space-evenly;
          flex-wrap: wrap;
          align-items: center;
          overflow: hidden;
          vertical-align: middle;
          min-height: calc(100% - 64px);
          padding-top: 64px;
        "
      >
        <!-- 房间列表 -->
        <div style="padding-top: 32px">
          <div
            style="
              text-align: center;
              font-size: xx-large;
              color: gray;
              margin-bottom: -80px;
            "
          >
            房间列表
          </div>
          <mu-flex
            class="flex-wrapper"
            justify-content="center"
            style="
              margin-top: 200px;
              float: left;
              align-content: stretch;
              margin-bottom: 60px;
            "
            wrap="wrap"
          >
            <mu-flex
              v-for="(house, index) in homeHouses"
              :key="house.id"
              @click="enterHomeHouse(house.id, house.name, house.needPwd)"
            >
              <mu-tooltip :content="house.desc">
                <mu-badge
                  :content="house.population ? house.population + '' : '0'"
                  circle
                  color="info"
                  style="margin: 8px 7px"
                  class="demo-icon-badge"
                >
                  <mu-chip class="demo-chip" color="primary">
                    <mu-avatar :size="32" color="secondary">
                      <mu-icon
                        :value="house.needPwd ? 'lock' : 'lock_open'"
                      ></mu-icon>
                    </mu-avatar>
                    {{ house.name }}
                  </mu-chip>
                </mu-badge>
              </mu-tooltip>
            </mu-flex>
          </mu-flex>
        </div>
        <!-- 新建房间 -->
        <div>
          <div
            style="
              text-align: center;
              font-size: xx-large;
              color: gray;
              margin-bottom: -120px;
              margin-top: 60px;
            "
          >
            新建房间
          </div>
          <mu-flex
            class="flex-wrapper"
            justify-content="center"
            style="margin-top: 200px; float: left; align-content: stretch"
            wrap="wrap"
          >
            <mu-form :model="homeHouse" class="mu-demo-form" align="center">
              <div align="center">
                <mu-text-field
                  v-model="homeHouse.name"
                  placeholder="房间名称"
                  style="color: #989898de"
                ></mu-text-field>
                <br />
                <mu-text-field
                  v-model="homeHouse.desc"
                  placeholder="房间描述"
                  style="color: #989898de"
                ></mu-text-field>
                <br />
                <mu-text-field
                  v-if="homeHouse.needPwd"
                  placeholder="房间密码"
                  v-model="homeHouse.password"
                  :action-icon="visibility ? 'visibility_off' : 'visibility'"
                  :action-click="() => (visibility = !visibility)"
                  :type="visibility ? 'text' : 'password'"
                  style="color: #989898de"
                ></mu-text-field>
                <br />
                <mu-text-field
                  action-icon="favorite"
                  :action-click="
                    () =>
                      linkDownload('https://music.skyrocketing.ninja/sponsor')
                  "
                  v-if="homeHouse.enableStatus"
                  v-model="homeHouse.retainKey"
                  placeholder="赞赏后获得订单号"
                  style="color: #989898de"
                ></mu-text-field>
              </div>
              <mu-flex
                class="flex-wrapper"
                align-items="center"
                style="
                  display: flex;
                  clear: both;
                  flex-direction: row;
                  justify-content: space-evenly;
                  flex-wrap: wrap;
                  align-items: center;
                  margin-bottom: 60px;
                "
              >
                <mu-switch
                  v-model="homeHouse.needPwd"
                  color="primary"
                  label="房间密码"
                ></mu-switch>
                <mu-switch
                  v-model="homeHouse.enableStatus"
                  color="primary"
                  label="房间永存"
                ></mu-switch>
                <mu-button color="primary" @click="createHomeHouse">
                  创建房间
                </mu-button>
              </mu-flex>
            </mu-form>
          </mu-flex>
        </div>
      </div>
      <mu-dialog
        id="sharereach"
        width="100%"
        transition="slide-bottom"
        fullscreen
        :open.sync="openShareReach"
      >
        <mu-appbar color="primary" :title="houseReachName">
          <mu-button
            slot="right"
            flat
            @click="openShareReach = !openShareReach"
          >
            ❌ 关闭
          </mu-button>
        </mu-appbar>
        <mu-icon
          @click="reachHouse"
          value="play_circle_filled"
          color="primary"
          size="150"
          style="
            position: fixed;
            top: calc(50% - 75px);
            left: calc(50% - 75px);
            cursor: pointer;
          "
        ></mu-icon>
      </mu-dialog>
    </div>
    <!-- 音乐搜索 -->
    <mu-dialog
      id="search"
      width="100%"
      transition="slide-bottom"
      fullscreen
      :open.sync="openSearch"
    >
      <mu-appbar color="primary" title="🎶 搜索音乐">
        <mu-button slot="right" flat @click="openUser">😀 搜索用户</mu-button>
        <mu-button slot="right" flat @click="openGd">🧾 搜索歌单</mu-button>
        <mu-button slot="right" flat @click="closeGq">❌</mu-button>
      </mu-appbar>
      <mu-container style="width: 100%">
        <mu-row>
          <mu-col>
            <mu-text-field
              :value="searchKeyword"
              @input="updateSearchKeyword"
              @keydown.enter="search"
              :placeholder="placeHolderGq"
              color="#fb8e00"
              class="width-size-100"
              style="text-align: center"
            ></mu-text-field>
            <mu-radio
              :value="'Netease'"
              v-model="source"
              color="primary"
              :label="'使用网易云音乐搜索'"
              class="searchradio"
            ></mu-radio>
            <br />
            <mu-radio
              :value="'qq'"
              v-model="source"
              color="primary"
              :label="'使用QQ音乐搜索'"
              class="searchradio"
            ></mu-radio>
          </mu-col>
          <mu-col span="1">
            <mu-button class="search_btn" icon @click="search">
              <mu-icon value="search"></mu-icon>
            </mu-button>
          </mu-col>
        </mu-row>
        <mu-row>
          <mu-data-table
            style="background-color: transparent"
            :selectable="false"
            :hover="false"
            :columns="searchColumns"
            :data="searchData"
          >
            <template slot-scope="scope">
              <td class="is-left">{{ scope.$index + 1 }}</td>
              <td class="is-left">
                <a
                  v-if="showPickButton(scope.row.privilege)"
                  @click="pickMusic(scope.row)"
                >
                  <mu-avatar size="20" slot="avatar">
                    <img src="../assets/images/play.png" />
                  </mu-avatar>
                </a>
                <mu-avatar
                  size="20"
                  slot="avatar"
                  v-if="!showPickButton(scope.row.privilege)"
                >
                  <mu-tooltip content="当前音乐不能点播">
                    <img src="../assets/images/noplay.png" />
                  </mu-tooltip>
                </mu-avatar>
                {{ scope.row.name }}
              </td>
              <td class="is-center">{{ scope.row.artist }}</td>
              <td class="is-center">
                {{ scope.row.album.name }}
              </td>
              <td class="is-center">
                {{ formatterTime(scope.row.duration / 1000) }}
              </td>
            </template>
          </mu-data-table>
        </mu-row>
        <mu-row>
          <mu-flex justify-content="center">
            <mu-pagination
              :total="searchCount"
              :current.sync="current"
              :page-count="pageCount"
              :page-size="limit"
              @change="paginationChange"
            ></mu-pagination>
          </mu-flex>
        </mu-row>
      </mu-container>
    </mu-dialog>
    <!-- 歌单搜索 -->
    <mu-dialog
      id="searchGd"
      width="100%"
      transition="slide-bottom"
      fullscreen
      :open.sync="openSearchGd"
    >
      <mu-appbar color="primary" title="🧾 搜索歌单">
        <mu-button slot="right" flat @click="openUser">😀 搜索用户</mu-button>
        <mu-button slot="right" flat @click="openGq">🎶 搜索音乐</mu-button>
        <mu-button slot="right" flat @click="closeGd">❌</mu-button>
      </mu-appbar>
      <mu-container style="width: 100%">
        <mu-row>
          <mu-col>
            <mu-text-field
              :value="searchKeywordGd"
              @input="updateSearchKeywordGd"
              @keydown.enter="searchGd"
              :placeholder="placeHolderGd"
              color="#fb8e00"
              class="width-size-100"
              style="text-align: center"
            ></mu-text-field>
            <mu-radio
              :value="'NeteaseSonglist'"
              v-model="sourceGd"
              color="primary"
              :label="'使用网易云音乐搜索'"
              class="searchradio"
            ></mu-radio>
            <br />
            <mu-radio
              :value="'QQMusicSonglist'"
              v-model="sourceGd"
              color="primary"
              :label="'使用QQ音乐搜索'"
              class="searchradio"
            ></mu-radio>
            <br />
            <mu-radio
              :value="'NeteaseUser'"
              v-model="sourceGd"
              color="primary"
              :label="'使用网易云音乐搜索用户歌单'"
              class="searchradio"
            ></mu-radio>
            <br />
            <mu-radio
              :value="'QQUser'"
              v-model="sourceGd"
              color="primary"
              :label="'使用QQ音乐搜索用户歌单'"
              class="searchradio"
            ></mu-radio>
          </mu-col>
          <mu-col span="1">
            <mu-button class="search_btn" icon @click="searchGd">
              <mu-icon value="search"></mu-icon>
            </mu-button>
          </mu-col>
        </mu-row>
        <mu-row>
          <mu-data-table
            style="background-color: transparent"
            :selectable="false"
            :hover="false"
            :columns="searchColumnsGd"
            :data="searchDataGd"
          >
            <template slot-scope="scope2">
              <td class="is-left">
                {{ scope2.$index + 1 }}.
                <a @click="songlistDetail(scope2.row)">
                  <mu-icon :value="'reply'"></mu-icon>
                </a>
                {{ scope2.row.name }}
              </td>
              <td>
                <mu-card-media width="50px" heigth="50px">
                  <img :src="scope2.row.pictureUrl" />
                </mu-card-media>
              </td>
              <td class="is-center">{{ scope2.row.desc | ellipsis }}</td>
              <td class="is-center">{{ scope2.row.creator }}</td>
              <td class="is-center">{{ scope2.row.creatorUid }}</td>
              <td class="is-center">{{ scope2.row.id }}</td>
              <td class="is-center">{{ scope2.row.playCount }}</td>
              <td class="is-center">{{ scope2.row.songCount }}</td>
            </template>
          </mu-data-table>
        </mu-row>
        <mu-row>
          <mu-flex justify-content="center">
            <mu-pagination
              :total="searchCountGd"
              :current.sync="currentGd"
              :page-count="pageCount"
              :page-size="limit"
              @change="paginationChangeGd"
            ></mu-pagination>
          </mu-flex>
        </mu-row>
      </mu-container>
    </mu-dialog>
    <!-- 用户搜索 -->
    <mu-dialog
      id="searchUser"
      width="100%"
      transition="slide-bottom"
      fullscreen
      :open.sync="openSearchUser"
    >
      <mu-appbar color="primary" title="😀 搜索用户">
        <mu-button slot="right" flat @click="openGdFromUser"
          >🧾 搜索歌单</mu-button
        >
        <mu-button slot="right" flat @click="openGq">🎶 搜索音乐</mu-button>
        <mu-button slot="right" flat @click="closeUser">❌</mu-button>
      </mu-appbar>
      <mu-container style="width: 100%">
        <mu-row>
          <mu-col>
            <mu-text-field
              :value="searchKeywordUser"
              @input="updateSearchKeywordUser"
              @keydown.enter="searchUser"
              placeholder="请输入用户昵称"
              color="#fb8e00"
              class="width-size-100"
              style="text-align: center"
            ></mu-text-field>
            <mu-radio
              :value="'Netease'"
              v-model="sourceUser"
              color="primary"
              :label="'使用网易云音乐搜索'"
              class="searchradio"
            ></mu-radio>
          </mu-col>
          <mu-col span="1">
            <mu-button class="search_btn" icon @click="searchUser">
              <mu-icon value="search"></mu-icon>
            </mu-button>
          </mu-col>
        </mu-row>
        <mu-row>
          <mu-data-table
            style="background-color: transparent"
            :selectable="false"
            :hover="false"
            :columns="searchColumnsUser"
            :data="searchDataUser"
          >
            <template slot-scope="scope3">
              <td class="is-left">
                {{ scope3.$index + 1 }}.
                <a @click="songtableDetail(scope3.row)">
                  <mu-icon :value="'reply'"></mu-icon>
                </a>
                {{ scope3.row.nickname }}
              </td>
              <td class="is-center">
                <mu-avatar size="36">
                  <img :src="scope3.row.avatarUrl" />
                </mu-avatar>
              </td>
              <td class="is-center">{{ scope3.row.userId }}</td>

              <td class="is-center">{{ scope3.row.signature | ellipsis }}</td>
              <td class="is-center">{{ scope3.row.description | ellipsis }}</td>
              <td class="is-center">
                {{
                  scope3.row.gender == 1
                    ? "男"
                    : scope3.row.gender == 2
                    ? "女"
                    : "未知"
                }}
              </td>
            </template>
          </mu-data-table>
        </mu-row>
        <mu-row>
          <mu-flex justify-content="center">
            <mu-pagination
              :total="searchCountUser"
              :current.sync="currentUser"
              :page-count="pageCount"
              :page-size="limit"
              @change="paginationChangeUser"
            ></mu-pagination>
          </mu-flex>
        </mu-row>
      </mu-container>
    </mu-dialog>
    <!-- 二维码分享 -->
    <mu-dialog
      id="share"
      width="100%"
      transition="slide-bottom"
      fullscreen
      :open.sync="openShare"
    >
      <mu-appbar color="primary" title="📲 分享" subtitle="扶摇 musicroom">
        <mu-button slot="right" flat @click="openShare = !openShare">
          ❌</mu-button
        >
      </mu-appbar>
      <mu-flex class="flex-wrapper" justify-content="center">
        <mu-card style="max-width: 375px; margin-top: 20px" align="center">
          <mu-card-header
            :title="musichouse"
            :sub-title="homeDesc ? homeDesc : '做一个自带背景音乐的人'"
            align="left"
          >
            <mu-avatar slot="avatar" size="50">
              <img src="../assets/images/logo.png" />
            </mu-avatar>
          </mu-card-header>
          <mu-card-media style="width: 250px">
            <img :src="miniQrcode" />
          </mu-card-media>
          <mu-card-title sub-title="扫码直接传送到该房间"></mu-card-title>
          <mu-card-media style="margin-top: 10px">
            <qrcode-vue
              id="qrcodeBox"
              level="H"
              :size="qrcodeVue.size"
              :value="qrcodeVue.value"
              :background="qrcodeVue.bgColor"
              :foreground="qrcodeVue.fgColor"
            ></qrcode-vue>
          </mu-card-media>
          <mu-card-title
            title="分享链接"
            :sub-title="qrcodeVue.value"
          ></mu-card-title>
        </mu-card>
      </mu-flex>
    </mu-dialog>
    <!-- 斗图 -->
    <mu-dialog id="search-picture" width="auto" :open.sync="openPictureSearch">
      <chat-search-picture></chat-search-picture>
    </mu-dialog>
    <!-- 房间内的房间列表 -->
    <mu-dialog
      id="house_dialog"
      width="100%"
      transition="slide-bottom"
      fullscreen
      :open.sync="openHouse"
    >
      <mu-appbar color="primary" title="🏡 房间列表">
        <mu-button slot="right" flat @click="closeHouse">❌</mu-button>
      </mu-appbar>
      <mu-flex class="flex-wrapper" justify-content="center">
        <mu-form :model="house" class="mu-demo-form" align="center">
          <div align="center">
            <mu-text-field
              v-model="house.name"
              placeholder="房间名称"
            ></mu-text-field>
            <mu-text-field
              v-model="house.desc"
              placeholder="房间描述"
            ></mu-text-field>
            <mu-text-field
              v-if="house.needPwd"
              placeholder="房间密码"
              v-model="house.password"
              :action-icon="visibility ? 'visibility_off' : 'visibility'"
              :action-click="() => (visibility = !visibility)"
              :type="visibility ? 'text' : 'password'"
            ></mu-text-field>
            <mu-text-field
              action-icon="favorite"
              :action-click="
                () => linkDownload('https://music.skyrocketing.ninja/sponsor')
              "
              v-if="house.enableStatus"
              v-model="house.retainKey"
              placeholder="赞赏后获得订单号"
            ></mu-text-field>
          </div>
          <mu-flex class="flex-wrapper" align-items="center">
            <mu-flex class="flex-demo" justify-content="end" fill>
              <mu-switch
                v-model="house.needPwd"
                color="primary"
                label="房间密码"
              ></mu-switch>
            </mu-flex>
            <mu-flex class="flex-demo" justify-content="start">
              <mu-button color="primary" @click="createHouse">
                创建房间
              </mu-button>
            </mu-flex>
            <mu-flex class="flex-demo" justify-content="start" fill>
              <mu-switch
                v-model="house.enableStatus"
                color="primary"
                label="房间永存"
              ></mu-switch>
            </mu-flex>
          </mu-flex>
        </mu-form>
      </mu-flex>
      <mu-flex
        class="flex-wrapper"
        justify-content="center"
        style="padding-top: 30px"
        wrap="wrap"
      >
        <mu-flex
          v-for="(houseItem, index) in houses"
          :key="houseItem.id"
          @click="enterHouse(houseItem.id, houseItem.name, houseItem.needPwd)"
        >
          <mu-tooltip :content="houseItem.desc">
            <mu-badge
              :content="houseItem.population ? houseItem.population + '' : '0'"
              circle
              color="info"
              style="margin: 8px 7px"
              class="demo-icon-badge"
            >
              <mu-chip class="demo-chip" color="primary">
                <mu-avatar :size="32" color="secondary">
                  <mu-icon
                    :value="houseItem.needPwd ? 'lock' : 'lock_open'"
                  ></mu-icon>
                </mu-avatar>
                {{ houseItem.name }}
              </mu-chip>
            </mu-badge>
          </mu-tooltip>
        </mu-flex>
      </mu-flex>
    </mu-dialog>
    <!-- 教程 -->
    <mu-drawer
      width="300"
      :open.sync="openManual"
      :docked="false"
      :right="true"
    >
      <mu-card style="width: 100%; max-width: 375px; margin: 0 auto">
        <mu-card-header title="使用教程">
          <mu-avatar size="45" slot="avatar">
            <img
              style="
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.2);
              "
              src="../assets/images/logo.png"
            />
          </mu-avatar>
        </mu-card-header>
      </mu-card>
      <mu-card-title
        title="用户"
        sub-title="以下命令在聊天框输入"
      ></mu-card-title>
      <mu-card-text>
        <p>
          1.输入 “点歌 歌名” 即可点歌。例如：点歌 春夏秋冬，支持输入网易云音乐
          ID 点歌。
        </p>
        <br />
        <p>
          2.没有想要点的音乐？ 请点击--> “
          <span
            @click="
              openManual = !openManual;
              openSearch = !openSearch;
            "
            style="cursor: pointer; color: #fb8e00"
          >
            [点歌]
          </span>
          “，如果知道歌单id，还可以在歌曲窗口直接加*搜索：
          <span style="color: #fb8e00">*歌单ID</span>
          <br />
        </p>
        <br />
        <p>
          3.不知道歌单ID?,请点击-->
          <span
            @click="
              openManual = !openManual;
              openSearchGd = !openSearchGd;
            "
            style="cursor: pointer; color: #fb8e00"
          >
            [歌单]
          </span>
          提示：歌单页面可以搜索网易云音乐歌单、网易云音乐用户的歌单、QQ音乐歌单和QQ音乐用户的歌单
        </p>
        <br />

        <p>
          4.如点错歌曲可以输入 “
          <span style="color: #fb8e00">删除音乐 歌名</span>
          ” 即可删除歌曲，管理员可以使用歌曲ID删除。
        </p>
        <br />
        <p>
          5.如遇不好听的歌可以输入 “
          <span style="color: #fb8e00">投票切歌</span>
          ” 或者点击 “
          <span @click="musicSkipVote" style="cursor: pointer; color: #fb8e00">
            [切歌]
          </span>
          ”，默认当投票人数大于在线人数 30% 时将会切歌。管理员可以设置切歌率。
        </p>
        <br />
        <p>
          6.输入 “
          <span style="color: #fb8e00">设置昵称 名字</span>
          ” 可以设置自己的显示昵称，仅限当前客户端有效。
        </p>
        <br />
        <p>
          7.私聊：输入 “
          <span style="color: #fb8e00">@用户id 内容</span>
          ” 可以私聊相应用户，用户id即用户ip后面那一串字母，如ju2etxv2。
          不知道用户id,试着点击在线人数图标。
        </p>
        <br />

        <p>
          8.想要斗图？
          <span
            @click="
              openManual = !openManual;
              openPictureSearch = !openPictureSearch;
            "
            style="cursor: pointer; color: #fb8e00"
          >
            [斗图]
          </span>
          ”
        </p>
        <br />
        <p>
          9.倒计时退出房间 输入 “
          <span style="color: #fb8e00">倒计时退出 1</span>
          ” 则将在1分钟后退出房间。取消倒计时退出：
          <span style="color: #fb8e00">取消退出</span>
          ”
        </p>
        <br />
        <p>
          10.如果有什么好的想法、建议或问题可以单项向管理员发送消息, “
          <span style="color: #fb8e00">@管理员 内容</span>
          ”, 空格隔开哦!
        </p>
        <br />
      </mu-card-text>

      <mu-divider></mu-divider>
      <mu-card-title
        title="管理员"
        sub-title="以下命令在聊天框输入"
      ></mu-card-title>
      <mu-card-text>
        <p>
          1.登录： “
          <span style="color: #fb8e00">admin 123456</span>
          ” 。
        </p>
        <br />
        <p>
          2.修改密码： “
          <span style="color: #fb8e00">修改密码 654321</span>
          ” 。
        </p>
        <br />
        <p>
          3.管理员公告 “
          <span style="color: #fb8e00">公告 请文明聊天</span>
          ”。
        </p>
        <br />
        <p>
          4.点赞模式（歌曲列表按点赞数排序）： “
          <span style="color: #fb8e00">点赞模式</span>
          ” 退出则“
          <span style="color: #fb8e00">退出点赞模式</span>
          ” 。
        </p>
        <br />
        <p>
          5.随机模式（歌曲列表随机播放）： “
          <span style="color: #fb8e00">随机模式</span>
          ” 退出则“
          <span style="color: #fb8e00">退出随机模式</span>
          ” 。
        </p>
        <br />
        <p>
          6.修改投票切歌率： “
          <span style="color: #fb8e00">投票切歌率 1</span>
          ” 数值在(0,1]。如：设置成0.5则表示房间人数一半赞同即可切歌。
        </p>
        <br />
        <p>
          7.禁止切歌：“
          <span style="color: #fb8e00">禁止切歌</span>
          ” 启用则“
          <span style="color: #fb8e00">启用切歌</span>
          ” 。
        </p>
        <br />
        <p>
          8.禁止点歌：“
          <span style="color: #fb8e00">禁止点歌</span>
          ” 启用则“
          <span style="color: #fb8e00">启用点歌</span>
          ” 。
        </p>
        <br />
        <p>
          9.清空列表：“
          <span style="color: #fb8e00">清空列表</span>
          ” 。
        </p>
        <br />
        <p>
          10.清空默认播放列表：“
          <span style="color: #fb8e00">清空默认列表</span>
          ” 。
        </p>
        <br />
        <p>
          11.设置默认播放列表（当点歌列表为空时，默认从此加载歌曲）：“
          <span style="color: #fb8e00">设置默认列表 24381616,1</span>
          ” ，其中243881616和1是歌单ID
        </p>
        <br />
        <p>
          12.默认列表歌曲数：“
          <span style="color: #fb8e00">默认列表歌曲数</span>
          ” 。
        </p>
        <br />
        <p>
          13.置顶音乐： “
          <span style="color: #fb8e00">置顶音乐 音乐ID</span>
          ” 音乐ID即歌曲列表中歌曲后面那一串字母，如411214279。
        </p>
        <br />
        <p>
          14.拉黑音乐：“
          <span style="color: #fb8e00">拉黑音乐 音乐ID</span>
          ” 漂白音乐：“
          <span style="color: #fb8e00">漂白音乐 音乐ID</span>
          ” 。
        </p>
        <br />
        <p>
          15.音乐黑名单： “
          <span style="color: #fb8e00">音乐黑名单</span>
          ” 。
        </p>
        <br />
        <p>
          16.拉黑用户：“
          <span style="color: #fb8e00">拉黑用户 用户ID</span>
          ” 漂白则“
          <span style="color: #fb8e00">漂白用户 用户ID</span>
          ” 用户ID即用户ip后面那一串字母，如ju2etxv2。
        </p>
        <br />
        <p>
          17.用户黑名单： “
          <span style="color: #fb8e00">用户黑名单</span>
          ” 。
        </p>
        <br />
        <p>
          18.设置点歌人：“
          <span style="color: #fb8e00">设置点歌人 用户ID</span>
          ” 用户ID即用户ip后面那一串字母，如ju2etxv2。取消则“
          <span style="color: #fb8e00">取消点歌人 用户ID</span>
          ” 。
        </p>
        <br />
        <p>
          19.设置切歌人：“
          <span style="color: #fb8e00">设置切歌人 用户ID</span>
          ” 用户ID即用户IP后面那一串字母，如ju2etxv2。取消则“
          <span style="color: #fb8e00">取消切歌人 用户ID</span>
          ” 。
        </p>
        <br />
      </mu-card-text>
    </mu-drawer>
    <!-- 音乐收藏列表 -->
    <mu-bottom-sheet
      id="sheet"
      :open.sync="open"
      style="max-height: 380px; overflow: auto"
    >
      <mu-list>
        <mu-sub-header>
          我的收藏
          <mu-button flat color="primary" @click="playAll">
            全部播放
          </mu-button>
          <mu-button flat color="primary" @click="removeAllCollect">
            取消所有收藏
          </mu-button>
        </mu-sub-header>

        <mu-list-item v-for="(value, name, index) in favoriteMap">
          <mu-list-item-action @click="removeCollect(value)" style="width: 10%">
            <mu-icon value="favorite" color="red"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-action
            @click="pickMusicNoToast(value)"
            style="width: 10%"
          >
            <mu-icon value="play_arrow" color="teal"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title style="width: 80%">
            {{ index + 1 }}.{{ value.name }}|{{ value.artist }}|{{
              value.album.name
            }}
          </mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { sendUtils, messageUtils, timeUtils, musicUtils } from "../utils";
import { baseUrl, isProduction } from "../config/environment";
import Navigation from "../components/Navigation";
import ChatSearchPicture from "../components/ChatSearchPicture";
import QrcodeVue from "qrcode.vue";
export default {
  name: "Music",
  components: {
    Navigation,
    ChatSearchPicture,
    QrcodeVue,
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 20) {
        return value.slice(0, 20) + "...";
      }
      return value;
    },
  },
  computed: {
    ...mapGetters({
      isContented: "getIsConnected",
      online: "getSocketOnline",
      chatMessage: "getChatMessage",
      chatData: "getChatData",
      music: "getPlayerMusic",
      progress: "getPlayerProgress",
      playerTime: "getPlayerTime",
      pick: "getPlayerPick",
      lyric: "getPlayerLyric",
      isRoot: "isSocketRoot",
      isAdmin: "isSocketAdmin",
      good: "isSocketGood",
      searchKeyword: "getSearchKeyword",
      searchKeywordGd: "getSearchKeywordGd",
      searchKeywordUser: "getSearchKeywordUser",
      searchData: "getSearchData",
      searchDataGd: "getSearchDataGd",
      searchDataUser: "getSearchDataUser",
      searchCount: "getSearchCount",
      searchCountGd: "getSearchCountGd",
      searchCountUser: "getSearchCountUser",
      music2: "getMusic2",
    }),
    ...mapMutations({}),
    volume: {
      get: function () {
        return this.$store.getters.getPlayerVolume;
      },
      set: function (value) {
        music.volume = Number(value) / 100;
        this.$store.commit("setPlayerVolume", value);
      },
    },
  },
  data: () => ({
    isPlay: false,
    columns: [
      { title: "ID", name: "id", width: 88, align: "left" },
      { title: "歌曲", name: "name", width: 200, align: "left" },
      { title: "歌手", name: "calories", align: "center" },
      { title: "专辑", name: "fat", align: "center" },
      { title: "点歌人", name: "carbs", align: "center" },
    ],
    albumRotate: false,
    screenWidth: document.documentElement.clientWidth,
    albumRotateSize: 300,
    albumRotateStyle: "",
    openSearch: false,
    openSearchGd: false,
    openSearchUser: false,
    openHouse: false,
    openManual: false,
    searchColumns: [
      { title: "ID", name: "id", width: 40, align: "left" },
      { title: "歌曲", name: "name", width: 200, align: "left" },
      { title: "歌手", name: "artist", align: "center" },
      { title: "专辑", name: "album", align: "center" },
      { title: "时长", name: "duration", align: "center" },
    ],
    searchColumnsGd: [
      { title: "歌单", name: "name", width: 200, align: "left" },
      { title: "封面", name: "pictureUrl", align: "center" },
      { title: "描述", name: "desc", align: "center" },
      { title: "创建者", name: "creator", align: "center" },
      { title: "创建者ID", name: "creatorUid", align: "center" },
      { title: "歌单ID", name: "id", align: "center" },
      { title: "播放量", name: "playCount", align: "center" },
      { title: "曲数", name: "songCount", align: "center" },
    ],
    searchColumnsUser: [
      { title: "昵称", name: "nickname", width: 200, align: "left" },
      { title: "头像", name: "avatarUrl", align: "center" },
      { title: "用户ID", name: "userId", align: "center" },
      { title: "签名", name: "signature", align: "center" },
      { title: "描述", name: "description", align: "center" },
      { title: "性别", name: "gender", align: "center" },
    ],
    keyword: "",
    current: 1,
    currentGd: 1,
    currentUser: 1,
    limit: 10,
    pageCount: 7,
    openPictureSearch: false,
    source: "Netease",
    sourceGd: "Netease",
    sourceChat: "Netease",
    sourceUser: "Netease",
    house: {
      name: "",
      desc: "",
      password: "",
      needPwd: false,
      enableStatus: false,
      retainKey: "",
    },
    homeHouse: {
      name: "",
      desc: "",
      password: "",
      needPwd: false,
      enableStatus: false,
      retainKey: "",
    },
    secondUrl: "",
    firstLoaded: 0,
    houses: [],
    homeHouses: [],
    musichouse: "一起听歌吧",
    loading: {},
    houseForward: "",
    visibility: false,
    favorite: false,
    playingId: "",
    houseId: "",
    housePwd: "123",
    connectType: "",
    houseIdNoAction: "",
    housePwdNoAction: "123",
    connectTypeNoAction: "",
    placeHolderGd: "搜索直接点搜索😏",
    placeHolderGq: "请输入关键字搜索",
    backgroundDiv: {
      overflow: "auto",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zoom: 1,
      background: "",
      "background-size": "100% 100%",
      "background-size": "cover",
      "-webkit-background-size": "cover",
      "-o-background-size": "cover",
      "background-color": "cornsilk",
    },
    qrcodeVue: {
      size: 250,
      bgColor: "#fff",
      fgColor: "#000",
      value: "", //二维码地址
    },
    openShare: false,
    openShareReach: false,
    houseReachId: "",
    houseReachName: "直达房间",
    homeDesc: "",
    closeClock: null,
    announceToast: null,
    lastLyric: "",
    currentLyric: "",
    favoriteMap: {},
    open: false,
    miniQrcode: "",
  }),
  methods: {
    play: function () {
      this.getScreenWidth();
      this.isPlay = !this.isPlay;
      this.connect();
    },
    connect: function () {
      let _this = this;
      let socketClient = this.$store.getters.getSocketClient;
      let stompClient = this.$store.getters.getStompClient;

      socketClient = new SockJS(
        baseUrl +
          "/server?houseId=" +
          this.houseId +
          "&housePwd=" +
          this.housePwd +
          "&connectType=" +
          this.connectType
      );
      stompClient = Stomp.over(socketClient);

      if (isProduction) {
        stompClient.debug = () => {};
      }
      stompClient.connect(
        {},
        (frame) => {
          // console.log('连接到服务器成功！', frame);
          this.$store.commit("setSocketIsConnected", true);
          // pre onmessage
          let afterOnMessage = socketClient.onmessage;
          socketClient.onmessage = function (message) {
            _this.messageHandler(message);
            afterOnMessage(message);
          };

          // pre onclose
          let afterOnclose = socketClient.onclose;
          socketClient.onclose = function (e) {
            if (e.type === "close") {
              _this.$store.commit("setSocketIsConnected", false);
              _this.$store.commit("pushChatData", {
                type: "notice",
                content: "网络异常, 请尝试重新连接服务器!",
              });
              _this.$toast.error("网络异常, 请尝试重新连接服务器!");
              setTimeout(function () {
                if (!_this.$store.getters.getIsConnected) {
                  _this.connect();
                }
              }, 444);
            }
            afterOnclose(e);
          };

          let userName = window.localStorage.getItem("USER_NAME");
          if (userName) {
            this.settingName(userName);
          }

          this.subscribe();
        },
        (error) => {
          // console.log('连接到服务器失败！', error);
        }
      );

      this.saveSocket(socketClient, stompClient);
    },
    close: function () {
      let socketClient = this.$store.getters.getSocketClient;
      let stompClient = this.$store.getters.getStompClient;

      stompClient.disconnect();
      socketClient.close();
      this.isPlay = false;
      this.playingId = "";
      this.getHomeHouses();

      this.saveSocket(socketClient, stompClient);
    },
    subscribe: function () {
      let stompClient = this.$store.getters.getStompClient;

      stompClient.subscribe("/topic/chat", (response) => {
        let body = JSON.parse(response.body);
        if (body.code == "20000") {
          this.$toast.message({
            message: "系统通知：" + body.data,
            time: 30 * 1000,
            closeIcon: "close",
            close: true,
          });
        }
        //this.$store.commit("pushChatData", .data);
      });

      stompClient.subscribe("/topic/music/order", (response) => {
        // console.log('来自 /topic/music/order 频道的消息', response);
      });

      this.saveSocket(null, stompClient);
    },
    saveSocket: function (socketClient, stompClient) {
      if (socketClient !== null) {
        this.$store.commit("setSocketClient", socketClient);
      }
      if (stompClient !== null) {
        this.$store.commit("setStompClient", stompClient);
      }
    },
    sendHandler: function () {
      let stompClient = this.$store.getters.getStompClient;
      let chatMessage = this.$store.getters.getChatMessage;
      let instruction = sendUtils.parseInstruction(chatMessage);
      let content = "";
      switch (instruction) {
        case "点歌":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
          } else {
            stompClient.send(
              "/music/pick",
              {},
              JSON.stringify({
                name: content,
                source: this.sourceChat,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "投票切歌":
          this.musicSkipVote();
          break;
        case "设置昵称":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入昵称', chatMessage)
          } else {
            this.settingName(content);
          }
          break;
        case "通知":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入公告', chatMessage)
          } else {
            stompClient.send("/chat/notice/" + content, {}, JSON.stringify({}));
          }
          break;
        case "公告":
          content = sendUtils.parseContent(instruction, chatMessage);
          stompClient.send(
            "/chat/announce",
            {},
            JSON.stringify({ content: content })
          );
          break;
        case "root":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入 root 密码', chatMessage)
          } else {
            stompClient.send(
              "/auth/root",
              {},
              JSON.stringify({
                password: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "admin":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入 admin 密码', chatMessage)
          } else {
            stompClient.send(
              "/auth/admin",
              {},
              JSON.stringify({
                password: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "置顶音乐":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要置顶的音乐 id', chatMessage)
          } else {
            stompClient.send(
              "/music/top",
              {},
              JSON.stringify({
                id: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "删除音乐":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要删除的音乐 id', chatMessage)
          } else {
            stompClient.send(
              "/music/delete",
              {},
              JSON.stringify({
                id: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "设置默认列表":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要删除的音乐 id', chatMessage)
          } else {
            stompClient.send(
              "/music/setDefaultPlaylist",
              {},
              JSON.stringify({
                id: content,
                source: this.sourceChat,
              })
            );
          }
          break;
        case "清空列表":
          stompClient.send("/music/clear", {}, "");
          break;
        case "清空默认列表":
          stompClient.send("/music/clearDefaultPlayList", {}, "");
          break;
        case "音乐黑名单":
          stompClient.send("/music/blackmusic", {}, "");
          break;
        case "默认列表歌曲数":
          stompClient.send("/music/playlistSize", {}, "");
          break;
        case "用户黑名单":
          stompClient.send("/chat/blackuser", {}, "");
          break;
        case "调整音量":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            content = 0;
          }
          stompClient.send("/music/volumn/" + content, {}, "");
          break;
        case "倒计时退出":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (!/^\d+$/.test(content)) {
            this.$toast.message("请输入要在几分钟后退出");
          } else {
            this.setTimeToClose(content);
            this.$toast.message("设置成功，将在" + content + "分钟后退出");
          }
          break;
        case "取消退出":
          this.setTimeToClose(0);
          this.$toast.message("取消成功");
          break;
        case "修改密码":
          content = sendUtils.parseContent(instruction, chatMessage);

          stompClient.send("/auth/adminpwd/" + content, {}, "");

          break;
        case "修改root密码":
          content = sendUtils.parseContent(instruction, chatMessage);

          stompClient.send("/auth/rootpwd/" + content, {}, "");

          break;
        case "投票切歌率":
          content = sendUtils.parseContent(instruction, chatMessage);
          stompClient.send("/music/vote/" + content, {}, "");
          break;
        case "点赞模式":
          stompClient.send("/music/goodmodel/true", {}, "");
          break;
        case "退出点赞模式":
          stompClient.send("/music/goodmodel/false", {}, "");
          break;
        case "随机模式":
          stompClient.send("/music/randommodel/true", {}, "");
          break;
        case "退出随机模式":
          stompClient.send("/music/randommodel/false", {}, "");
          break;
        case "留存房间":
          stompClient.send("/house/retain/true", {}, "");
          break;
        case "不留存房间":
          stompClient.send("/house/retain/false", {}, "");
          break;
        case "禁止点歌":
          stompClient.send("/music/banchoose/true", {}, "");
          break;
        case "禁止切歌":
          stompClient.send("/music/banswitch/true", {}, "");
          break;
        case "启用切歌":
          stompClient.send("/music/banswitch/false", {}, "");
          break;
        case "启用点歌":
          stompClient.send("/music/banchoose/false", {}, "");
          break;
        case "拉黑用户":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要拉黑的用户 session', chatMessage)
          } else {
            stompClient.send(
              "/chat/black",
              {},
              JSON.stringify({
                sessionId: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "漂白用户":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要漂白的用户 session', chatMessage)
          } else {
            stompClient.send(
              "/chat/unblack",
              {},
              JSON.stringify({
                sessionId: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "设置点歌人":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要拉黑的用户 session', chatMessage)
          } else {
            stompClient.send("/auth/setPicker/" + content, {}, "");
          }
          break;
        case "取消点歌人":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要拉黑的用户 session', chatMessage)
          } else {
            stompClient.send("/auth/setNoPicker/" + content, {}, "");
          }
          break;
        case "设置切歌人":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要拉黑的用户 session', chatMessage)
          } else {
            stompClient.send("/auth/setVoter/" + content, {}, "");
          }
          break;
        case "取消切歌人":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要拉黑的用户 session', chatMessage)
          } else {
            stompClient.send("/auth/setNoVoter/" + content, {}, "");
          }
          break;
        case "拉黑音乐":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
            // console.log('请输入要拉黑的音乐 id', chatMessage);
          } else {
            stompClient.send(
              "/music/black",
              {},
              JSON.stringify({
                id: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "漂白音乐":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
          } else {
            // console.log('请输入要漂白的音乐 id', chatMessage);
            stompClient.send(
              "/music/unblack",
              {},
              JSON.stringify({
                id: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        case "@管理员":
          content = sendUtils.parseContent(instruction, chatMessage);
          if (content === "") {
          } else {
            stompClient.send(
              "/mail/send",
              {},
              JSON.stringify({
                content: content,
                sendTime: Date.now(),
              })
            );
          }
          break;
        default:
          if (
            chatMessage === null ||
            chatMessage === "" ||
            chatMessage.length === 0
          ) {
            // console.log('消息非法', chatMessage);
          } else {
            stompClient.send(
              "/chat",
              {},
              JSON.stringify({
                content: chatMessage,
                sendTime: Date.now(),
              })
            );
          }
          break;
      }
      this.$store.commit("setChatMessage", "");
    },
    messageHandler: function (source) {
      if (messageUtils.isKnowMessageType(source.data)) {
        let messageType = messageUtils.parseMessageType(source.data);
        let messageContent = messageUtils.parseMessageContent(source.data);
        switch (messageType) {
          case messageUtils.messageType.ONLINE:
            if (
              messageContent.data.count !== undefined &&
              typeof messageContent.data.count !== "undefined" &&
              messageContent.data.count !== null &&
              messageContent.data.count !== ""
            ) {
              this.$store.commit("setSocketOnline", messageContent.data.count);
            }
            break;
          case messageUtils.messageType.HOUSE_USER:
            let users = messageContent.data;
            for (let i = 0; i < users.length; i++) {
              this.$store.commit("pushChatData", {
                content:
                  i +
                  1 +
                  "." +
                  users[i].nickName +
                  "[" +
                  users[i].sessionId +
                  "]",
                type: "notice",
              });
            }
            break;
          case messageUtils.messageType.NOTICE:
            if (
              messageContent.message !== undefined &&
              typeof messageContent.message !== "undefined" &&
              messageContent.message !== null &&
              messageContent.message !== ""
            ) {
              this.$store.commit("pushChatData", {
                content: messageContent.message,
                type: "notice",
              });
              if (messageContent.message == "点歌成功")
                this.$toast.message({
                  message: messageContent.message,
                  time: 1000,
                });
            } else {
              this.$toast.message(messageContent.message);
            }
            break;
          case messageUtils.messageType.ANNOUNCEMENT:
            if (this.announceToast) {
              this.$toast.close(this.announceToast);
            }
            if (messageContent.data.content) {
              this.announceToast = this.$toast.message({
                message: "公告：" + messageContent.data.content,
                time: 60 * 1000,
                closeIcon: "close",
                close: true,
              });
            }
            break;
          case messageUtils.messageType.CHAT:
            // parse picture
            let imgList = [];
            let matchUrlList = messageContent.data.content.match(
              /[picture].*?:\/\/[^\s]*/gi
            );
            if (matchUrlList !== null) {
              for (let i = 0; i < matchUrlList.length; i++) {
                imgList.push(matchUrlList[i].replace("picture:", ""));
                messageContent.data.content = messageContent.data.content.replace(
                  matchUrlList[i],
                  ""
                );
              }
            }
            messageContent.data.images = imgList;
            this.$store.commit("pushChatData", messageContent.data);
            break;
          case messageUtils.messageType.GOODMODEL:
            var data = messageContent.data;
            if (data == "GOOD") {
              this.$store.commit("setSocketGood", true);
            } else {
              this.$store.commit("setSocketGood", false);
            }
            break;
          case messageUtils.messageType.PICK:
            if (messageContent.message == "goodlist") {
              this.$store.commit("setSocketGood", true);
            }
            this.$store.commit("setPlayerPick", messageContent.data);
            if (messageContent.data.length > 1) {
              this.secondUrl = messageContent.data[1].url;
              //console.log("this.firstLoaded"+this.firstLoaded);
              if (this.firstLoaded == 1) {
                this.$store.commit("setMusic2", { url: this.secondUrl });
              }
            }
            break;
          case messageUtils.messageType.VOLUMN:
            music.volume = Number(messageContent.data) / 100;
            this.$store.commit("setPlayerVolume", messageContent.data);
            break;
          case messageUtils.messageType.MUSIC:
            this.lastLyric = "";
            this.$store.commit("setPlayerLyric", "");
            this.firstLoaded = 0;
            this.$store.commit("setPlayerMusic", messageContent.data);
            document.querySelector("#music").preload = "auto";
            if (
              messageContent.data.lyric === undefined ||
              typeof messageContent.data.lyric === "undefined" ||
              messageContent.data.lyric === null ||
              messageContent.data.lyric === ""
            ) {
              this.$store.commit("setPlayerLyrics", []);
            } else {
              this.$store.commit(
                "setPlayerLyrics",
                musicUtils.parseLyric(messageContent.data.lyric)
              );
            }
            document.title = messageContent.data.name;
            break;
          case messageUtils.messageType.AUTH_ROOT:
            this.$store.commit("pushChatData", {
              content: messageContent.message,
              type: "notice",
            });
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setSocketRoot", true);
              // console.log('root success')
            } else {
              this.$store.commit("setSocketRoot", false);
            }
            break;
          case messageUtils.messageType.ENTER_HOUSE_START:
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setPlayerPick", new Array());
            }
            break;
          case messageUtils.messageType.ADD_HOUSE_START:
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setPlayerPick", new Array());
            }
            break;
          case messageUtils.messageType.ENTER_HOUSE:
            this.loading.close();
            if (Number(messageContent.code) === 20000) {
              this.houseId = this.houseIdNoAction;
              this.housePwd = this.housePwdNoAction;
              this.connectType = this.connectTypeNoAction;
              this.musichouse = this.houseForward;
              // console.log('root success')
              this.openHouse = false;
              document
                .querySelectorAll(".mu-tooltip")
                .forEach((el) => (el.style.display = "none"));
              let userName = window.localStorage.getItem("USER_NAME");
              if (userName) {
                this.settingName(userName);
              }
            } else {
              this.$toast.message(messageContent.message);
              this.getHouses();
            }
            break;
          case messageUtils.messageType.ADD_HOUSE:
            this.loading.close();
            if (Number(messageContent.code) === 20000) {
              this.musichouse = this.house.name;
              this.houseId = messageContent.data;
              this.housePwd = this.house.password;
              this.connectType = "";
              // console.log('root success')
              this.openHouse = false;
              document
                .querySelectorAll(".mu-tooltip")
                .forEach((el) => (el.style.display = "none"));
              let userName = window.localStorage.getItem("USER_NAME");
              if (userName) {
                this.settingName(userName);
              }
            } else {
              this.$toast.message(messageContent.message);
            }
            break;
          case messageUtils.messageType.AUTH_ADMIN:
            this.$store.commit("pushChatData", {
              content: messageContent.message,
              type: "notice",
            });
            if (Number(messageContent.code) === 20000) {
              this.$store.commit("setSocketAdmin", true);
            } else {
              this.$store.commit("setSocketAdmin", false);
            }
            break;
          case messageUtils.messageType.SETTING_NAME:
            this.$store.commit("pushChatData", {
              content: messageContent.message,
              type: "notice",
            });
            this.$store.commit("setSocketUserName", messageContent.data.name);
            break;
          case messageUtils.messageType.SEARCH:
            this.$store.commit("setSearchCount", messageContent.data.totalSize);
            this.$store.commit("setSearchData", messageContent.data.data);
            break;
          case messageUtils.messageType.SEARCH_SONGLIST:
            this.$store.commit(
              "setSearchCountGd",
              messageContent.data.totalSize
            );
            this.$store.commit("setSearchDataGd", messageContent.data.data);
            break;
          case messageUtils.messageType.SEARCH_USER:
            this.$store.commit(
              "setSearchCountUser",
              messageContent.data.totalSize
            );
            this.$store.commit("setSearchDataUser", messageContent.data.data);
            break;
          case messageUtils.messageType.SEARCH_HOUSE:
            this.houses = messageContent.data;
            break;
          case messageUtils.messageType.SEARCH_PICTURE:
            this.$store.commit(
              "setSearchPictureCount",
              messageContent.data.totalSize
            );
            this.$store.commit(
              "setSearchPictureData",
              messageContent.data.data
            );
            break;
          default:
            break;
        }
      }
    },
    updateChatMessage: function (value) {
      this.$store.commit("setChatMessage", value);
    },
    updateSearchKeyword: function (value) {
      this.$store.commit("setSearchKeyword", value);
    },
    updateSearchKeywordGd: function (value) {
      this.$store.commit("setSearchKeywordGd", value);
    },
    updateSearchKeywordUser: function (value) {
      this.$store.commit("setSearchKeywordUser", value);
    },
    settingName: function (name) {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/setting/name",
        {},
        JSON.stringify({
          name: name,
          sendTime: Date.now(),
        })
      );
    },
    search: function () {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/music/search",
        {},
        JSON.stringify({
          name: this.$store.getters.getSearchKeyword.trim(),
          sendTime: Date.now(),
          source: this.source,
          pageIndex: this.current,
          pageSize: this.limit,
        })
      );
    },
    searchGd: function () {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/music/searchsonglist",
        {},
        JSON.stringify({
          name: (this.$store.getters.getSearchKeywordGd + "").trim(),
          sendTime: Date.now(),
          source: this.sourceGd,
          pageIndex: this.currentGd,
          pageSize: this.limit,
        })
      );
    },
    searchUser: function () {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/music/searchuser",
        {},
        JSON.stringify({
          nickname: this.$store.getters.getSearchKeywordUser.trim(),
          sendTime: Date.now(),
          source: this.sourceUser,
          pageIndex: this.currentUser,
          pageSize: this.limit,
        })
      );
    },
    paginationChange: function (page) {
      this.current = page;
      this.search();
    },
    paginationChangeGd: function (page) {
      this.currentGd = page;
      this.searchGd();
    },
    paginationChangeUser: function (page) {
      this.currentUser = page;
      this.searchUser();
    },
    goodMusic: function (row) {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send("/music/good/" + row.id, {}, {});
      this.$toast.message(`[${row.id}]${row.name} - 已发送点赞请求`);
    },
    pickMusic: function (row) {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/music/pick",
        {},
        JSON.stringify({
          name: row.name,
          id: row.id,
          source: this.source,
          sendTime: Date.now(),
        })
      );
      this.$toast.message(`[${row.id}]${row.name} - 已发送点歌请求`);
    },
    pickMusicNoToast: function (row) {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/music/pick",
        {},
        JSON.stringify({
          name: row.name,
          id: row.id,
          source: row.source,
          sendTime: Date.now(),
        })
      );
    },

    showPickButton(value) {
      if (Number(value.st) < 0) {
        // 没有资源
        return false;
      } else if (Number(value.fl) === 0) {
        // 可能需要付费
        return false;
      }
      return true;
    },
    songlistDetail(value) {
      this.openSearchGd = false;
      this.openSearch = true;
      this.$store.commit("setSearchKeyword", "*" + value.id);
      this.source = this.sourceGd.startsWith("Netease") ? "Netease" : "qq";
      this.current = 1;
      this.search();
    },
    songtableDetail(value) {
      this.openSearchUser = false;
      this.openSearchGd = true;
      this.$store.commit("setSearchKeywordGd", value.userId);
      this.sourceGd = this.sourceUser + "_user";
      this.currentGd = 1;
      this.searchGd();
    },
    musicSkipVote: function () {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send("/music/skip/vote", {}, {});
    },
    houseUser: function () {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send("/house/houseuser", {}, {});
    },
    musicTimeUpdate: function (e) {
      // progress
      let currentTime = e.target.currentTime;
      let duration = e.target.duration;
      this.$store.commit("setPlayerProgress", (currentTime / duration) * 100);

      // show time
      let usedTimeHH_mm_ss = timeUtils.secondsToHH_mm_ss(currentTime);
      let durationHH_mm_ss = timeUtils.secondsToHH_mm_ss(duration);
      let time = usedTimeHH_mm_ss + " / " + durationHH_mm_ss;
      this.$store.commit("setPlayerTime", time);

      // lyric
      let lyrics = this.$store.getters.getPlayerLyrics;
      if (lyrics.length === 0) {
        this.$store.commit("setPlayerLyric", "暂无歌词");
      } else {
        let number = Number(currentTime.toFixed());
        if (
          lyrics[number] !== undefined &&
          lyrics[number] !== "" &&
          lyrics[number] != this.currentLyric
        ) {
          this.lastLyric = this.currentLyric;
          this.currentLyric = lyrics[number];
          this.$store.commit("setPlayerLyric", lyrics[number]);
        }
      }
    },
    getScreenWidth: function () {
      const _this = this;
      window.onresize = () => {
        return (() => {
          _this.screenWidth = document.documentElement.clientWidth;
        })();
      };
    },
    formatterTime: function (value) {
      return timeUtils.secondsToHH_mm_ss(value);
    },
    formatterFullTime: function (value) {
      return timeUtils.secondsToYYYY_HH_mm_ss(value);
    },
    nextSong: function (e) {
      this.firstLoaded = 1;
      this.$store.commit("setMusic2", { url: this.secondUrl });
    },
    closeHouse() {
      this.openHouse = false;
    },
    closeGd() {
      this.openSearchGd = false;
    },
    closeUser() {
      this.openSearchUser = false;
    },
    openGd() {
      this.openSearch = false;
      this.openSearchGd = true;
    },
    openGdFromUser() {
      this.openSearchUser = false;
      this.openSearchGd = true;
    },
    openGq() {
      this.openSearchGd = false;
      this.openSearch = true;
    },
    openUser() {
      this.openSearchGd = false;
      this.openSearchUser = true;
    },
    closeGq() {
      this.openSearch = false;
    },
    createHouse() {
      this.loading = this.$loading({ overlayColor: "hsla(0, 0%, 100%, .5)" });
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/house/add",
        {},
        JSON.stringify({
          name: this.house.name,
          desc: this.house.desc,
          needPwd: this.house.needPwd,
          password: this.house.password,
          enableStatus: this.house.enableStatus,
          retainKey: this.house.retainKey,
        })
      );
    },
    createHomeHouse() {
      this.loading = this.$loading({ overlayColor: "hsla(0, 0%, 100%, .5)" });
      this.$http
        .post("/house/add", {
          name: this.homeHouse.name,
          desc: this.homeHouse.desc,
          needPwd: this.homeHouse.needPwd,
          password: this.homeHouse.password,
          enableStatus: this.homeHouse.enableStatus,
          retainKey: this.homeHouse.retainKey,
        })
        .then((response) => {
          this.loading.close();
          if (response.data.code == "20000") {
            this.houseId = response.data.data;
            this.housePwd = this.homeHouse.password;
            this.connectType = "";
            this.play();
            this.musichouse = this.homeHouse.name;
            document
              .querySelectorAll(".mu-tooltip")
              .forEach((el) => (el.style.display = "none"));
          } else {
            this.$toast.message(response.data.message);
          }
        })
        .catch((error) => {
          this.loading.close();
        });
    },
    enterHouse(id, name, needPwd) {
      if (needPwd) {
        this.$prompt("", "请输入房间密码", {
          validator(value) {
            return {
              valid: value != "",
              message: "密码不能为空",
            };
          },
        }).then(({ result, value }) => {
          if (result) {
            this.houseEnter(id, name, value);
          }
        });
      } else {
        this.houseEnter(id, name, "");
      }
    },
    enterHomeHouse(id, name, needPwd) {
      if (needPwd) {
        this.$prompt("", "请输入房间密码", {
          validator(value) {
            return {
              valid: value != "",
              message: "密码不能为空",
            };
          },
        }).then(({ result, value }) => {
          if (result) {
            this.homeHouseEnter(id, name, value);
          }
        });
      } else {
        this.homeHouseEnter(id, name, "");
      }
    },
    houseEnter(id, name, pwd) {
      this.loading = this.$loading({ overlayColor: "hsla(0, 0%, 100%, .5)" });
      this.houseIdNoAction = id;
      this.housePwdNoAction = pwd;
      this.connectTypeNoAction = "enter";
      this.houseForward = name;
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send(
        "/house/enter",
        {},
        JSON.stringify({
          id: id,
          password: pwd,
        })
      );
    },
    homeHouseEnter(id, name, pwd) {
      this.loading = this.$loading({ overlayColor: "hsla(0, 0%, 100%, .5)" });
      this.$http
        .post("/house/enter", { id: id, password: pwd })
        .then((response) => {
          this.loading.close();
          if (response.data.code == "20000") {
            this.houseId = id;
            this.housePwd = pwd;
            this.connectType = "enter";
            this.play();
            this.musichouse = name;
            document
              .querySelectorAll(".mu-tooltip")
              .forEach((el) => (el.style.display = "none"));
          } else {
            this.$toast.message(response.data.message);
          }
        })
        .catch((error) => {
          this.loading.close();
        });
    },
    getHouses() {
      let stompClient = this.$store.getters.getStompClient;
      stompClient.send("/house/search", {}, JSON.stringify({}));
    },
    getHomeHouses() {
      this.$http
        .post("/house/search", {})
        .then((response) => {
          if (response.data.code == "20000") {
            this.homeHouses = response.data.data;
          }
        })
        .catch((error) => {});
    },
    clearScr() {
      document.getElementById("chat-container").innerHTML = "";
    },
    setCurrentTime() {
      this.playingId =
        this.$store.getters.getPlayerMusic.id +
        this.$store.getters.getPlayerMusic.source +
        this.$store.getters.getPlayerMusic.pushTime;
    },
    linkDownload(url) {
      window.open(url, "_blank"); // 新窗口打开外链接
    },
    playMusic() {
      document.querySelector("#music").play();
    },
    createTouchstartEventAndDispatch(el) {
      try {
        let event = document.createEvent("Events");
        event.initEvent("touchstart", true, true);
        el.dispatchEvent(event);
      } catch (Exception) {}
    },
    //生成二维码
    getQRcode() {
      this.homeDesc = "";
      this.$http
        .post("/house/get", { id: this.houseId })
        .then((response) => {
          if (response.data.code == "20000") {
            this.homeDesc = response.data.data.desc;
          } else {
            this.$toast.message(response.data.message);
          }
        })
        .catch((error) => {});
      let queryString =
        "houseId=" + this.houseId + "&housePwd=" + this.housePwd;
      this.qrcodeVue.value =
        "https://music.skyrocketing.ninja?" + encodeURIComponent(queryString); // 二维码内容
    },
    reachHouse() {
      let housePwd = this.getUrlKey("housePwd");
      this.homeHouseEnter(this.houseReachId, this.houseReachName, housePwd);
    },
    getUrlKey(name) {
      if (window.location.href.indexOf("?houseId") != -1) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = decodeURIComponent(window.location.search).substr(1).match(reg);
        //获取url中"?"符后的字符串并正则匹配
        let context = "";
        if (r != null) context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined"
          ? ""
          : context;
      } else {
        return null;
      }
    },
    setTimeToClose(minutes) {
      if (this.closeClock) {
        window.clearTimeout(this.closeClock);
      }
      if (minutes != 0) {
        this.closeClock = window.setTimeout(this.close, minutes * 60 * 1000);
      }
    },
    searchTop() {
      this.openSearch = true;
      this.$store.commit("setSearchKeyword", "*热歌榜");
      this.source = "Netease";
      this.current = 1;
      this.search();
    },
    collectMusic(row) {
      this.$set(this.favoriteMap, row.id, row);
      localStorage.setItem("collectMusic", JSON.stringify(this.favoriteMap));
    },
    removeCollect(row) {
      this.$delete(this.favoriteMap, row.id);
      localStorage.setItem("collectMusic", JSON.stringify(this.favoriteMap));
    },
    containCollect(id) {
      let result = this.favoriteMap[id] != null;
      console.log("aaa", result);
      return result;
    },
    closeBottomSheet() {
      this.open = false;
    },
    openBotttomSheet() {
      this.open = true;
    },
    removeAllCollect() {
      localStorage.removeItem("collectMusic");
      this.favoriteMap = {};
      this.open = false;
    },
    playAll() {
      let _this = this;
      for (let key in this.favoriteMap) {
        _this.pickMusicNoToast(_this.favoriteMap[key]);
      }
      this.open = false;
    },
  },
  watch: {
    sourceGd: function (newValue, oldValue) {
      this.currentGd = 1;
      if (newValue == "qq_user") {
        this.placeHolderGd = "QQ用户ID即QQ号";
      } else if (newValue == "NeteaseUser") {
        this.placeHolderGd = "不知道用户ID？点击右上角用户搜索按照用户名查询";
      } else {
        let placeholders = [
          "搜索“民谣”来听下吧",
          "试试直接搜索会怎样",
          "请输入关键字，如“摇滚”",
        ];
        this.placeHolderGd = placeholders[Math.floor(Math.random() * 3)];
      }
    },
    source: function (newValue, oldValue) {
      this.current = 1;
      let placeholders = [
        "请输入关键字搜索,如“酒醉的玫瑰”",
        "歌单id搜索:'*歌单id'",
        "不知道听啥？点击右上角搜索歌单",
      ];
      this.placeHolderGq = placeholders[Math.floor(Math.random() * 3)];
    },
    playingId: function (newValue, oldValue) {
      let _this = this;
      if (newValue != "" && newValue != oldValue) {
        this.albumRotate = false;
        document.querySelector("#music").volume =
          Number(this.$store.getters.getPlayerVolume) / 100;

        setTimeout(function () {
          _this.albumRotate = true;
          let pushTime = _this.$store.getters.getPlayerMusic.pushTime;
          if (pushTime) {
            document.querySelector("#music").currentTime =
              (Date.now() - pushTime) / 1000;
            _this.createTouchstartEventAndDispatch(document);
          }
        }, 1000);
      }
    },
    openHouse: function (newOpenHouse, oldOpenHouse) {
      if (newOpenHouse) {
        this.getHouses();
      }
    },
    openShare: function (newOpenHouse, oldOpenHouse) {
      if (newOpenHouse) {
        this.getQRcode();
      }
    },
    "$store.state.player.music": function (newValue, oldValue) {
      // 解决部分移动端不能自动播放
      document.addEventListener("touchstart", function () {
        document.getElementById("music").play();
      });
    },
    "$store.state.chat.data": function (newValue, oldValue) {
      setTimeout(function () {
        let chat = document.querySelector("#chat-container");
        chat.scrollTop = chat.scrollHeight;
      }, 100);
    },
    screenWidth(val) {
      //监控浏览器高度变化
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        let _this = this;
        setTimeout(function () {
          _this.timer = false;
        }, 400);
      }
      if (val <= 400) {
        this.albumRotateStyle =
          "border:60px solid rgb(12, 12, 12); padding: 8px;";
        this.pageCount = 3;
      }
      if (val > 400 && val <= 766) {
        this.albumRotateSize = 450;
        this.albumRotateStyle =
          "border:70px solid rgb(12, 12, 12); padding: 8px;";
        this.pageCount = 5;
      }
      if (val > 766 && val < 1000) {
        this.albumRotateSize = 160;
        this.albumRotateStyle =
          "border:32px solid rgb(12, 12, 12); padding: 4px;";
        this.pageCount = 9;
      }
      if (val >= 1000) {
        this.albumRotateSize = 200;
        this.albumRotateStyle =
          "border:40px solid rgb(12, 12, 12); padding: 4px;";
        this.pageCount = 11;
      }
    },
  },
  mounted() {
    this.getScreenWidth();
    this.$nextTick(function () {
      this.$http.defaults.baseURL = baseUrl;

      this.getHomeHouses();
      try {
        let houseId = this.getUrlKey("houseId");
        if (houseId) {
          this.openShareReach = true;
          this.houseReachId = houseId;
          this.$http
            .post("/house/get", { id: houseId })
            .then((response) => {
              if (response.data.code == "20000") {
                this.houseReachName = response.data.data.name;
              } else {
                this.$toast.message(response.data.message);
              }
            })
            .catch((error) => {});
        }
      } catch (Exception) {}
    });
    let collect = localStorage.getItem("collectMusic");
    if (collect && collect != undefined) {
      this.favoriteMap = JSON.parse(collect);
      console.log("收", this.favoriteMap);
    }
  },
  created() {
    let val = document.documentElement.clientWidth;
    if (val <= 400) {
      this.pageCount = 3;
    }
    if (val > 400 && val <= 700) {
      this.albumRotateSize = val - 60;
      this.albumRotateStyle = `border:${
        Math.floor(val / 10) + 10
      }px solid rgb(12, 12, 12);`;
      this.pageCount = 5;
    }
    if (val > 700 && val <= 766) {
      this.albumRotateSize = 450;
      this.albumRotateStyle = "border:70px solid rgb(12, 12, 12);";
      this.pageCount = 7;
    }
    if (val > 766 && val < 1000) {
      this.albumRotateSize = 160;
      this.albumRotateStyle = "border:32px solid rgb(12, 12, 12);";
      this.pageCount = 9;
    }
    if (val >= 1000) {
      this.albumRotateSize = 200;
      this.albumRotateStyle = "border:40px solid rgb(12, 12, 12);";
      this.pageCount = 11;
    }
  },
};
</script>

<style lang="scss" scoped>
.album {
  width: 100%;
  display: inline-block;
  cursor: pointer;
  transition-duration: 0.2s;
  padding: 4px;
  border: 32px solid rgb(16, 16, 16);
  border-radius: 50%;
  background: linear-gradient(
    rgb(39, 39, 39),
    rgb(0, 0, 0),
    rgb(0, 0, 0),
    rgb(39, 39, 39)
  );
}

.album-rotate {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
