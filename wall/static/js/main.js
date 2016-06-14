
function clear(){
	$('#wall>li').each(function(){
		if($(this).offset().top>$(window).height()){
			$(this).remove();
		}else if(($(this).offset().top+$(this).height()+20)>$(window).height()){
			$(this).fadeOut();
		}
	});
}
function push(d){
	//d {message:"text"}
	var id="li"+Math.random().toString().substring(2);
	$('ul#wall').prepend('<li id="'+id+'" style="display:none">'+d.message+'</li>');
	$('#'+id).slideDown(200,function(){
		clear();
	});
}

function forout(){
	push({message:'dsfio'+Math.random()});
}

//$(document).ready(function(){
/*
$(document).click(function(){
	forout();
});
*/
var socketClient=function(){
	return io.connect("ws://"+window.location.host+":"+window.location.port, {
		reconnection: false
	});
};
var socket=socketClient();
socket.on('connect', function(socket){
	console.log('conn ed');
	//socket.join(room);
});
socket.on('disconnect', function(){
	console.log('disconnected');
});
socket.on('news', function(data){
	push(data);
})
$(document).ready(function(){
	//setInterval(forout,1000);
	push({message:'就绪！等待微信消息！'});
});
