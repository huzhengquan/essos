const koa = require('koa'),
	views = require('koa-views'),
	path = require('path'),
	router = require('koa-router')(),
	socketIo = require('socket.io'),
	wechat = require('co-wechat'),
	config = require('nonfig')(),
	https = require('https'),
	os = require('os'),
	fs = require('fs');

const app= koa();

app.use(require('koa-static')(path.join(__dirname,"static")));

router.use(views('views', {
    map: { html: 'jade' },
    cache: false
}));

var io = false;
//大屏幕浏览
var links={
	"100":{
		"name":"默认",
		"users":{}
	}
};
var user_dict={};//微信账号

function create(name){
	var roomid = Math.max(Math.max.apply(null,Object.keys(links)), 10)+1;
	links[roomid]={
		"name":name,
		"users":{}
	};
	return roomid;
}
function join(openid, roomid){
	user_dict[openid]=roomid;
}

/*
wechat message:
{ ToUserName: 'gh_2891725956b2',
FromUserName: 'ofO94jum8QMsOF-WtV0uJqYMPOSQ',
CreateTime: '1454213271',
MsgType: 'text',
Content: 'ceshi',
MsgId: '6245798440756178368' 

weixin token:
{ access_token: 'dvqxJ4x7uFPxldITzUNZYgoBXlNKl9oSelxi3kQ8k-9AT-akCmH4GL7PMBE3NW0LvkiKPXkqn3sy_npHKifepW7jooRk5kzHx0UKap25Xf95hTDWbt_J21qk3XFDcQmCZBBbAAAJLL',
  expires_in: 7200 }

*/
/*
var access_token={"token":null,"expire":0};
function update_access_token(call){
	console.log('update_access_token');
	var now=new Date().getTime();
	if(access_token.expire>now){
		call(access_token.token);
		return;
	}
	//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
	https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.weixin.AppID+'&secret='+config.weixin.AppSecret, (res) => {
		res.on('data', (d) => {
			const wdata = JSON.parse(d.toString());
			console.log('get token', wdata);
			access_token.token=wdata.access_token;
			access_token.expire=now+wdata.expires_in*1000;
			call(access_token.token);
		});
	});

}
function doevent(data){
	console.log('doevent', data);
	if(data.Event=='subscribe'){ // 订阅
		update_access_token(function(token){
			console.log('will write userinfo');
			https.get('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+data.FromUserName+'&lang=zh_CN', (res) => {
				res.on('data', (d) => {
					const wdata = d.toString();//JSON.parse(d.toString());
					console.log('write userinfo', wdata);
					const dir = path.join(os.tmpdir(),config.weixin.local.user_dir);
					if(!fs.existsSync(dir)){
						fs.mkdirSync(dir);
					}
					fs.writeFileSync(path.join(dir, data.FromUserName));
				});
			});
		});
	}
}
*/

router.post('/weixin/message', wechat(config.weixin.Token).middleware(function *() {
	// 微信输入信息都在this.weixin上
	var data= this.weixin;
	console.log(data);
	if(data.MsgType=='event'){
		//doevent(data);
		return;
	}
	if(data.MsgType!='text'){
		this.body="目前仅支持文字消息";
		return;
	}
	var uid=data.FromUserName;
	if(data.Content.substring(0,5)=='join:'){
		var roomid = data.Content.substring(5);
		if(links.hasOwnProperty(roomid)){
			join(uid, roomid);
			this.body="已加入“"+links[roomid].name+"”";
		}else{
			this.body="不存在的活动号";
		}
		return;
	}else if(data.Content.substring(0,7)=='create:'){
		var roomname= data.Content.substring(7);
		var roomid = create(roomname);
		join(uid, roomid);
		this.body="已创建并已加入“"+links[roomid].name+"”, 大屏幕: http://essos.unclose.org/wall/"+roomid;
		return;
	}
	var roomid = user_dict[uid] || "100";
	if(links.hasOwnProperty(roomid)){
		//上墙
		/*
		var auther={
			nickname:'未知'
		};
		try{
			auther = JSON.parse(fs.readFileSync(path.join(os.tmpdir, config.weixin.local.user_dir, uid)).toString());
		}catch (e){
			console.log(e);
		}
		*/
		for(var socketid in links[roomid]['users']){
			links[roomid]['users'][socketid].emit('news', {
				message:data.Content
			});
		}
		this.body="已上墙";
	}else{
		this.body="不存在的活动";
	}
	/*
	return;
	if (message.FromUserName === 'diaosi') {
		// 回复屌丝(普通回复)
		this.body = 'hehe';
	} else if (message.FromUserName === 'text') {
		//你也可以这样回复text类型的信息
		this.body = {
			content: 'text object',
			type: 'text'
		};
	} else if (message.FromUserName === 'hehe') {
		// 回复一段音乐
		this.body = {
			type: "music",
			content: {
				title: "来段音乐吧",
				description: "一无所有",
				musicUrl: "http://mp3.com/xx.mp3",
				hqMusicUrl: "http://mp3.com/xx.mp3"
			}
		};
	} else if (message.FromUserName === 'kf') {
		// 转发到客服接口
		this.body = {
			type: "customerService",
			kfAccount: "test1@test"
		};
	} else {
		// 回复高富帅(图文回复)
		this.body = [
			{
				title: '你来我家接我吧',
				description: '这是女神与高富帅之间的对话',
				picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
				url: 'http://nodeapi.cloudfoundry.com/'
			}
		];
	}
	*/
}));

/*
router.get('/weixin/message', function *(){
	for(var room in links){
		for(var id in links[room]){
			links[room][id].emit('news', {
				message:'world'
			});
		}
	}
	this.body='test';
});
*/
router.get('/:id', function *(){
	yield this.render('index.jade',{"room":this.params.id});
});

app.use(router.routes());

exports.app=app;



function ioListen(){
	io.on('connection', function(socket){
		var room = socket.handshake.headers.referer.split('/').pop();
		console.log('conned',room);
		if(!links.hasOwnProperty(room)){
			links[room]={"name":"未命名", "users":{}};
		}
		links[room]['users'][socket.id]=socket;
		socket.on('disconnect', function(){
			var room = socket.handshake.headers.referer.split('/').pop();
			delete links[room]["users"][this.id];
		});
		/* test
		for(var room in links){
			for(var id in links[room]){
				links[room][id].emit('news', {
					hello:'world'
				});
			}
		}
		*/
	});
}
exports.initialize = function(http){
	io = socketIo(http);
	ioListen();
};


