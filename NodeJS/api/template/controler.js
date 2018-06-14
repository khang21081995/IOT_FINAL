function hello(req, res, next) {
    res.send("Hello world");
}
function byebye(req, res, next) {
    res.send("Bye Bye world");
}

module.exports = {
    hello,
    byebye
}