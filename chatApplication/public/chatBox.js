$(document).ready(function () {
    var socket = io();
    var listener="";
    var lastListener = ""
    var user = document.getElementById("username").innerHTML;
    function clearChatWindow(){
        document.getElementById("messages").innerHTML = "";
    }

    $("#activeUsers").on("click",".onlineUser",function(){
        $(this).toggleClass("bg-success")
        if($(this).attr("id")!=listener){
            clearChatWindow();
            lastListener = listener;
            listener = $(this).attr("id");
            if(lastListener.length!=0){
                $("#"+lastListener).toggleClass("bg-success");
            }
            console.log("Clicked listener:- "+listener);
        }
        event.stopPropagation();
    });

    $('form').submit(function(e){
        e.preventDefault();
        var userMsg = {message:$('#m').val(),username:user,id:listener}
            socket.emit('chat message', userMsg);
        $('#m').val('');
        return false;
    });

    function autoScroll(){
        $('#messages').animate({
            scrollTop: $('#messages').get(0).scrollHeight
        }, 2000);
    }

    socket.on('chat message', function(msg){
        var today = new Date();
        if(listener.length!=0){
            if(listener==msg.username||msg.username==user){
                if(msg.username==user)
                    $('#messages').append('<div class="message-own"><h5>'+msg.message+'</small></h5><p>'+msg.username+' <small>'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'</p></div>');
                else
                    $('#messages').append('<div class="message"><h5>'+msg.message+'</small></h5><p>'+msg.username+' <small>'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'</p></div>');
            }
            else{
                $("#"+msg.username).find('span').text("New Message");
                console.log("new message from :- "+msg.username);
            }
            autoScroll();
        }
        else{
            $('#messages').append('<div class="message"><h5>'+msg.message+'</small></h5><p>'+msg.username+' <small>'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'</p></div>');
            listener = msg.username;
            $("#"+listener).toggleClass("bg-success");
            autoScroll(); 
        }
    });

    socket.on('common chatRoom',function(msg){
        if(msg.username==user)
            $('#messages').append('<div class="message-own"><h5>'+msg.message+'</small></h5><p>'+msg.username+' <small>'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'</p></div>');
        else
            $('#messages').append('<div class="message"><h5>'+msg.message+'</small></h5><p>'+msg.username+' <small>'+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'</p></div>');
    });

    socket.on('new user',function(msg){
        $('#activeUsers').append('<li class="container mb-1 list-group-item onlineUser" id="'+msg+'">'+msg+'<span class="badge txt-success">Online</span></li>');
    });
});