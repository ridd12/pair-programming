const path = require('path')
const express=require('express')
const http= require('http')
const socketio=require('socket.io')

//http is required inorder to start socketio
var axios = require('axios');


const Filter=require('bad-words')
const { generateMessage,generateLocation }= require('./utils/messages')
const {addUser,getUser,removeUser,getUsersInRoom}=require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')


var cursorData = []; 


app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
  console.log('New web socket connection')

  socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})

    if(error){
      return callback(error)
    }


    // console.log((generateMessage('Adim','welcom1!')).name)
    socket.join(user.room)
    console.log("gg")
    // socket.emit('message',generateMessage('Admin','welcome!'))
    // // console.log(username)
    // // console.log(room)
    // socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
    socket.broadcast.to(user.room).emit('make_cursor_div',user.username)
    socket.emit('make_cursor_overselves',user.username,getUsersInRoom(user.room))
    io.to(user.room).emit('roomData',{
      room:user.room,
      users:getUsersInRoom(user.room)
    })
    callback()

  })

  socket.on('cursor',(username_,room,x,y,callback) =>{


    // io.to(user.room).emit('message',generateLocation(user.username,mess))
    //initially this was done ie io.emit so all the users and self all see the same that is ridddhish also sees riddish khot ka message hai aaisa
    //but now what i am doing is broadcast except self user the name and then socket.emit to only self with name "you"
    socket.broadcast.to(room).emit('cur',username_,x,y)

  })

  socket.on('location',(mess,callback)=>{
    const user=getUser(socket.id)
    var data = JSON.stringify({
          "code":mess,
          "language":"py",
          "input":""
          });
    var output="";
    var config = {
    method: 'post',
    url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
    headers: { 
    'Content-Type': 'application/json'
    },
    data : data
    };

    axios(config)
    .then(function (response) {
    console.log("hiinin")
    console.log(response.data.output);
    output=response.data.output;
    // const link="https://www.google.com/maps?q="+mess[0]+","+mess[1]
    // io.to(user.room).emit('location-message',generateLocation(user.username,link))
    //initially this was done ie io.emit so all the users and self all see the same that is ridddhish also sees riddish khot ka message hai aaisa
    //but now what i am doing is broadcast except self user the name and then socket.emit to only self with name "you"
    // console.log(link)
    console.log("jere")
    // console.log(output)
    socket.broadcast.to(user.room).emit('location-message',generateLocation(user.username,output))
    socket.emit('location-message',generateLocation('You',output))

    callback()
    })
    .catch(function (error) {
    console.log(error);
    });
    
  })
  // // socket.emit('joined',(mess))
  // const link="https://www.google.com/maps?q="+mess[0]+","+mess[1]
  // io.emit('joined',link)


    //socket.emit - sends information to a specific users
    //io.emit - sends information to all connected to server
    //socket.broadcast.emit - sends information to a all users except for that specific user
    //io.to(room.no).emit - sends information to a specific room
    //socket.broadcast.to(room.no).emit - sends information to all users in that specific room except for that specific user




  socket.on('update',(mess,callback) =>{
    const filter = new Filter()
    const user=getUser(socket.id)
    // const usersInRoom=getUsersInRoom(user.room)
    // console.log(user.username)
    // socket.emit('joined',(mess))
    if (filter.isProfane(mess)) {
      return callback('profanity is not allowed')
    }

    // io.to(user.room).emit('message',generateLocation(user.username,mess))
    //initially this was done ie io.emit so all the users and self all see the same that is ridddhish also sees riddish khot ka message hai aaisa
    //but now what i am doing is broadcast except self user the name and then socket.emit to only self with name "you"
    io.to(user.room).emit('mes',generateMessage(user.username,mess))
    callback()

  })

  socket.on('disconnect',()=>{
    const user=removeUser(socket.id)
    if (user)
    {
      io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
    }
  })
  // socket.emit('countUpdated',count)
  //
  // socket.on('update',()="Admin",> {
  //   count++
  //   //this below statement only emits the event to a specific connection
  //   // socket.emit('countUpdated',count)
  //   //whereas io.emit emit to all connections connected at that point
  //   io.emit('countUpdated',count)
  // })
})

server.listen(port,()=>{
  console.log(`server is running on port ${port}!`)
})
