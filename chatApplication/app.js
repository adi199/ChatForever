const express = require('express')
const app = express();
 
app.set('view engine','ejs');
app.use(express.static('public'))

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

server = app.listen(4000,function(){
    console.log('Server is up.....') 
})  
 
var users = []
var userList = {}

const io = require('socket.io')(server)
io.on('connection', function(socket){
    userList[users[users.length-1]] = socket.id
    console.log("new connection")
    socket.on('chat message', function(userMsg){
      var msg = {message:userMsg.message,username:userMsg.username}
      console.log(userList[userMsg.username])
      if(userMsg.id in userList){
        socket.emit('chat message', msg)
        socket.broadcast.to(userList[userMsg.id]).emit('chat message', msg)
      } 
      else
        console.log("Message id unknown :- "+userMsg.id);
    });
    io.on('disconnect',function(userMsg){
        console.log("User Disconnected");
    })
});
 
app.get('/',function(req,res){
    res.render('login',{message:""})
    app.post('/chatRoom',function(req,res){
        var check = 0;
        var msg = req.body.username
        console.log("here")
        var password = req.body.password
        console.log(password)
        if(password=='aditya'){
            for(var i=0;i<users.length;i++){
                if(msg==users[i]){
                    res.render('login',{message:"Username already exist"})
                    check = 1;
                    break;
                }
            }        
            if(check==0){
                users.push(msg)
                console.log(msg+" Entered ChatRoom , No of users :- "+users.length)
                res.render('chatBox',{user:msg,list:users});
                io.emit('new user',msg); 
            }
        }
        else
            res.redirect('/')
    });
});

