const net = require('net');
const validator = require('validator');
const host = '127.0.0.1';
const port = 9009;

const client = net.connect({port, host}, function() {
    // console.log('当前客户端对象 =>', this);
    this.on('error',err => {
        console.log('客户端监听到服务端报错信息:', JSON.stringify(err));
    });
    // 1、连接成功后，客户端说大家好，发给服务端
    this.write(JSON.stringify({ type: 'emit', data: `大家好，我是${getMac()}` }))
    this.on('data', res => { // 这个事件监听----可以证明this指向的就是client对象
        // console.log('用this对象(指向client)接收服务端消息 =>', res.toString());
        // console.log(JSON.parse(res.toString()).type); // 直接转换成json对象
        // 3、注意：这里的逻辑--客户端收到广播或者服务端消息，不能立即回复，应该是展示在控制台或前端页面上，应该是这个逻辑，否则会无限循环
        // this.write(JSON.stringify({ type: 'emit', data: '我是客户端消息' }) + '\n')
        // 3、这里我们选择收到服务端消息后，打印消息在控制台即可
        try {
            // console.log('我是res消息 =>', res);
            // console.log('我是res.toString()消息 =>', res.toString());
            let resJson = res.toString();
            if (validator.isJSON(resJson)) {
                console.log('客户端收到服务端JSON格式消息 =>', JSON.parse(resJson));
                console.log('客户端收到服务端JSON格式消息 data数据：=>', JSON.parse(resJson).data);
                
            }else {
                console.log('客户端收到服务端其它格式消息 =>', res.toString());
            }
            
        } catch (error) {
            console.log('接收服务端消息报错 =>', error);
        }
    })
    this.on('close', res => {
        console.log('==========================服务端关闭连接================================');
    })
    
    // // exp.write('hello world Socket Server.');
});
// client.on('data', res => {
//     console.log('服务端消息 =>', res.toString());
    
// })
// client.on('close', res => {
//     console.log('==========================服务端关闭连接================================');

// })
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.address;
               }
          }
    }
}
function getMac() {
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.mac;
               }
          }
    }
}
function isBuffer(str) {
    return str && typeof str === "object" && Buffer.isBuffer(str)
}