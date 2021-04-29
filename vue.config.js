module.exports = {
    publicPath: "./",
    pwa: {
        name: "扶摇 musicroom",
        themeColor: "#FAB962",
        msTileColor: "#FAB962",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "black",
        // configure the workbox plugin (GenerateSW or InjectManifest)
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: "src/service-worker.js",
            importWorkboxFrom: "disabled",
            importScripts: "https://cdn.jsdelivr.net/npm/workbox-sw@4.3.1/build/workbox-sw.min.js",
            // ...other Workbox options...
        },
    },
};
