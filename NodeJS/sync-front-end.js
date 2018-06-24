var browserSync = require('browser-sync');
browserSync.init({
    // server: "server/www",
    proxy: "localhost:28888",
    files: ["public/**/*.*", "views/**/*.*"],
    browser: ["firefox"],
    port: "3000",
    startPath: "/"
});
