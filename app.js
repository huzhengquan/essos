var koa = require('koa'),
	mount = require("koa-mount");


var app = koa();

app.keys = ['kindle','lumia','meet'];

//日志
app.use(require('koa-logger')());

//商店
app.use(mount("/shop",require('./shop').app));

//微信功能
app.use(mount("/weixin",require("./weixin").app));

app.listen(process.env.PORT || 3000);
//app.listen(process.env.PORT || 3000);
console.log('listening on port 3000');

