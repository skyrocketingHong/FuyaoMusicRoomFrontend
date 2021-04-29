// 缓存web的css资源
workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // 使用缓存，但尽快在后台更新
    workbox.strategies.staleWhileRevalidate({
        // 使用自定义缓存名称
        cacheName: "css-cache",
    })
);

// 缓存web的js资源
workbox.routing.registerRoute(
    // 缓存JS文件
    /.*\.js/,
    // 使用缓存，但尽快在后台更新
    workbox.strategies.staleWhileRevalidate({
        // 使用自定义缓存名称
        cacheName: "js-cache",
    })
);

// 缓存web的图片资源
workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 设置缓存有效期为30天
            }),
        ],
    })
);

// 缓存get api请求的数据
workbox.routing.registerRoute(
    new RegExp("https://music.skyrocketing.ninja/musicroom"),
    workbox.strategies.networkFirst({
        cacheName: "api",
    })
);
