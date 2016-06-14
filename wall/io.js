var socketIo = require('socket.io');

var io = false;
var links={};

function ioListen(){
	io.on('connection', function(socket){
		var room = socket.handshake.headers.referer.split('/').pop();
		console.log('conned',room);
		if(!links.hasOwnProperty(room)){
			links[room]={};
		}
		links[room][socket.id]=socket;
		socket.on('disconnect', function(){
			var room = socket.handshake.headers.referer.split('/').pop();
			delete links[room][this.id];
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


