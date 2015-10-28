var koa = require('koa');

exports.app = koa();

exports.app.use(function *(next){
	yield next;
	this.body = "weixin";
});
