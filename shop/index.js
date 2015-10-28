var koa = require('koa'),
	hbs = require('koa-handlebars'),
	path = require('path');

exports.app = koa();

exports.app.use(hbs({
	defaultLayout: "main",
	extension:  [ "hbs", "handlebars", "tpl", "html" ],
	root: __dirname
}));

exports.app.use(require('koa-static')(path.join(__dirname,"static")));

exports.app.use(function *(next){
	yield this.render('test',{});
});
