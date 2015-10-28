var koa = require('koa'),
	mount = require("koa-mount");


var app = koa();

var shop = require("./shop");
app.use(mount("/shop",shop.app));

var weixin = require("./weixin");
app.use(mount("/weixin",weixin.app));

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);

