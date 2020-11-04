require('libs/Mixins.js');

const themeListeners = [];

App({
    globalData: {
        theme: 'light', // dark
        cus:{},
        urlc:'https://pany.seaway.net.cn/XWD/',
        urlc1:'http://pany.seaway.net.cn:8082/XWD/',
        urls:'http://localhost:8080/XWD/',
        openid:'',
    },
    themeChanged(theme) {
        this.globalData.theme = theme;
        themeListeners.forEach((listener) => {
            listener(theme);
        });
    },
    watchThemeChange(listener) {
        if (themeListeners.indexOf(listener) < 0) {
            themeListeners.push(listener);
        }
    },
    unWatchThemeChange(listener) {
        const index = themeListeners.indexOf(listener);
        if (index > -1) {
            themeListeners.splice(index, 1);
        }
    },
});