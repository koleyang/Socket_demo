var net = require('net'); // 导入net库
var chatServer = net.createServer(); // 创建服务端net服务

var index = 0, // 客户端流水编号
    clientMap = new Object(); // 客户端集合对象

chatServer.on('connect', function(client) {
    console.log('有人连上来了');
    client.name = ++ index; // 给客户端一个流水号
    clientMap[client.name] = client;
    client.on('data', function(data) {
        console.log('客户端传来数据'+data);
        broadcast(data, client); // 广播来自其中一个客户端想消息
    });
    client.on('error', function(exception) {
        console.log('客户端报错信息是'+exception);
        client.end();
    });
    client.on('close', function(data) {
        delete clientMap[client.name]; // js原生方法，删除对象中的一个属性
        console.log(client.name + '下线了');
        broadcast(client.name + '下线了', client);
    });
});
function broadcast(data, client) {
    for (var key in clientMap) { // 遍历客户端对象集
        clientMap[key].write(client.name + 'say:' + data + '\n');
    }
}
chatServer.listen(9009, function () {   //监听9009端口，写个回调来表示服务端启动服务成功
    console.log("webSocket 服务端启动 9009 port");
});