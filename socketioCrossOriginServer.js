//初始化系统库（引包）
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//引入socket.io这个包
var socketio = require('socket.io')(server);
var path = require("path");
//加载前端文件index.html

//设置静态路径
// app.use('/', express.static('./view'));
app.use('/lib',express.static("./lib"));
app.use(express.static(path.join(__dirname, "views")));
app.get('/index', function (request, response) {
    response.sendFile('./views/index.html');
});

//监听用户连接事件
socketio.on('connection', function (socket) {
    //设置房间，获取用户当前的url，从而截取出房间id
    //var url = socket.request.headers.referer;

    //接收客户端发送来的消息
    socket.on('custom', function (data) {
        console.log(data)//我是客户端自定义的消息
    });

    socket.on('server', function (data) {
        //向客户端发送消息
        socket.emit('system', 'hello!客户端')
    });

});
server.listen(9004, function() {
    console.log('server port 9004');
});