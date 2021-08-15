// var net = require('net'); // 导入net库
// var chatServer = net.createServer(); // 创建服务端net服务

// var index = 0, // 客户端流水编号
//     clientMap = new Object(); // 客户端集合对象

// chatServer.on('connect', function(client) {
//     console.log('有人连上来了');
//     client.name = ++ index; // 给客户端一个流水号
//     clientMap[client.name] = client;
//     client.on('data', function(data) {
//         console.log('客户端传来数据'+data);
//         broadcast(data, client); // 广播来自其中一个客户端想消息
//     });
//     client.on('error', function(exception) {
//         console.log('客户端报错信息是'+exception);
//         client.end();
//     });
//     client.on('close', function(data) {
//         delete clientMap[client.name]; // js原生方法，删除对象中的一个属性
//         console.log(client.name + '下线了');
//         broadcast(client.name + '下线了', client);
//     });
// });
// function broadcast(data, client) {
//     for (var key in clientMap) { // 遍历客户端对象集
//         clientMap[key].write(client.name + 'say:' + data + '\n');
//     }
// }
// chatServer.listen(9009, function () {   //监听9009端口，写个回调来表示服务端启动服务成功
//     console.log("webSocket 服务端启动 9009 port");
// });

const net = require('net');

const clientMap = {}; // map client object
let ii = 0; // number of clients

net.createServer(client => { // client就是连接到服务端的客户端套接字
    console.log('有客户端连接上来.');
    client.name = ++ii; // 定义client客户端name属性，赋值流水号
    clientMap[client.name] = client; // 往映射对象里面添加连接上来的client客户端对象
    client.on('error', err => {
        console.log('服务端监听到客户端报错信息:', JSON.stringify(err));
        client.end(); // 错误事件触发end()关闭客户端方法--关闭客户端
    });
    // client.write(JSON.stringify({ type: 'watching', data: '我是服务端初始化消息' }) + '\n');
    // client.write(JSON.stringify({ type: 'emit', data: `玩家${client.name}上线了` }));
    broadcast(`玩家${client.name}上线了`)
    client.on('data', data => {
        console.log('服务端监听到客户端发来的数据data =>', data.toString());
        // 2、服务端收到客户端消息后就进行广播，这个没错----但是客户端收到服务端消息就不能继续发消息给服务端，否则就是无限循环
        if (JSON.parse(data.toString()).type === 'emit') {
            setTimeout(() => {
                // broadcast(JSON.parse(data.toString()).data, client)
                broadcast(`${client.name}say:${JSON.parse(data.toString()).data}`)
            }, 500)
        }else {
            console.log('客户端消息 =>', JSON.parse(data.toString()).data);
        }
    });
    client.on('close', () => {
        delete clientMap[client.name];
        console.log('客户端 断开连接 disconnected.');
        // broadcast(`${client.name}下线了`, client)
        broadcast(`${client.name}下线了`)
    });
   
}).listen(9009, () => console.log('服务端已经启动，端口9009'));

// const broadcast = (msg, client) => {// 这个广播方法应该可以改造的更灵活，传个消息进来就行，不需要传client参数
//     for (const key in clientMap) {
//         // clientMap[key].write(`${client.name}say:${msg}\n`);
//         clientMap[key].write(JSON.stringify({ type: 'emit', data: `${client.name}say,${msg}`}));
//     }
// }
// 改造广播方法如下
const broadcast = (data) => {// 这个广播方法应该可以改造的更灵活，传个消息进来就行，不需要传client参数
    for (const key in clientMap) {
        clientMap[key].write(JSON.stringify({ type: 'emit', data }));
    }
}