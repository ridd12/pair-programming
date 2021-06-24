const socket=io()
//

//picking variables to make buttons off till the time the output is given
const $messageFormInput=document.querySelector('#box')
// const $messageFormInput=$messageForm.querySelector('input')
// const $messageFormButton=$messageForm.querySelector('button')
const $location_button=document.querySelector('#send-location')


//for renderning the message usnig mustache
const $messageDiv=document.querySelector('#messages')
const messageTemplate=document.querySelector('#message-template').innerHTML

//for rendering the location as  a link
// const $messageDiv=document.querySelector('#messages')
const locationTemplate=document.querySelector('#location-template').innerHTML


//for cursor
const $cursorDiv=document.querySelector('#c')
const cursorTemplate=document.querySelector('#cursor-template').innerHTML



//for sidebars
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML



function setCaretPosition(ctrl, pos) {
  // Modern browsers
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);

  // IE8 and below
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}


const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll=()=>{
    const $newMessage=$messageDiv.lastElementChild

    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin


    const visibleHeight=$messageDiv.offsetHeight

    const containerHeight=$messageDiv.scrollHeight

    const scrollOffset=$messageDiv.scrollTop + visibleHeight


    if(containerHeight - newMessageHeight <= scrollOffset){
    $messageDiv.scrollTop=$messageDiv.scrollHeight
    // console.log("top")
    // console.log(containerHeight - newMessageHeight , scrollOffset)

    }
    else{
    //   console.log("Bottom")

    //   console.log(containerHeight - newMessageHeight , scrollOffset)
    //
  }

}


// const $messageFormInput=document.querySelector('#box')
// const $messageFormInput=$messageForm.querySelector('input')


//
// socket.emit('linkforvideo',room,()=>{
//   // console.log('location was shared!')
//   console.log("link for video is shared")
// })


socket.on('make_cursor_div',(username)=>{
  // console.log(message)
  var html = Mustache.render(cursorTemplate,{
    //this is done using a mustache library the {{dynamic}} part if changed to the second argument that is also message which is the above one consoleloggedone!
    userid:username
  })
  // html.setAttribute("id", username)
  // html.id = username;
  $cursorDiv.insertAdjacentHTML('beforeend',html)
  const $cursorFormInput=document.querySelector('#c')

  if ($cursorFormInput.querySelector('#changer').id){
    $cursorFormInput.querySelector('#changer').id=username
    // console.log("fs")
  }
  else{
    // console.log("fsssss")
  }

  // autoscroll()
})

socket.on('make_cursor_overselves',(username,aa)=>{
  console.log(aa)

  aa.forEach(user_name => {
    if (user_name.username != username) {



  var html = Mustache.render(cursorTemplate,{
    //this is done using a mustache library the {{dynamic}} part if changed to the second argument that is also message which is the above one consoleloggedone!
    userid:user_name.username
  })
  // html.setAttribute("id", username)
  // html.id = username;
  $cursorDiv.insertAdjacentHTML('beforeend',html)
  const $cursorFormInput=document.querySelector('#c')

  if ($cursorFormInput.querySelector('#changer').id){
    $cursorFormInput.querySelector('#changer').id=user_name.username
    // console.log("fs")
  }
  else{
    // console.log("fsssss")
  }
  }
  });





})


socket.on('message',(message)=>{
  // console.log(message)
  const html = Mustache.render(messageTemplate,{
    //this is done using a mustache library the {{dynamic}} part if changed to the second argument that is also message which is the above one consoleloggedone!
    username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('h:mm a')

  })
  $messageDiv.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('mes',(message)=>{
  // console.log(message.text+String("kkk"))

  document.getElementById('box').value = message.text;


  // document.getElementById("box").setAttribute('value',message.text);








  // console.log(message)
  // const html = Mustache.render(messageTemplate,{
  //   //this is done using a mustache library the {{dynamic}} part if changed to the second argument that is also message which is the above one consoleloggedone!
  //   username:message.username,
  //   message:message.text,
  //   createdAt:moment(message.createdAt).format('h:mm a')

  // })
  // $messageDiv.insertAdjacentHTML('beforeend',html)
  // autoscroll()
})

socket.on('cur',(username_,x,y)=>{
  // console.log(x)
  // console.log(y)
  // autoscroll()

  var $cursorFormInput=document.querySelector('#c')
  var var_name="#"+username_
  // console.log(var_name)
  var d=$cursorFormInput.querySelector(var_name)
  d.style.left = x+'px'
  d.style.top = y+'px'
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
      room,
      users
    })
    document.querySelector('#sidebar').innerHTML=html
})


socket.on('location-message',(message)=>{
  console.log(message)
  const html = Mustache.render(locationTemplate,{
    //this is done using a mustache library the {{dynamic}} part if changed to the second argument that is also location which is the above one consoleloggedone!
    username:message.username,
    location:message.link,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messageDiv.insertAdjacentHTML('beforeend',html)
  autoscroll()
})





// document.querySelector('#box').addEventListener('keypress',(e)=>{
//   e.preventDefault()
//   console.log("keypress")
//   const addAt=document.getElementById("box").selectionStart
//   const m= document.getElementById("box").value

//   // $messageFormButton.setAttribute('disabled','disabled')
//   // console.log(e.key)
//   var mess = [m.slice(0, addAt), e.key, m.slice(addAt)].join('');




//   // console.log(document.getElementById("box").value)

//   // var myElement = document.getElementById('text-element');
//   //       var startPosition = myElement.selectionStart;
//   // console.log(mess)


//   socket.emit('update',mess,(error)=>{
//     // console.log("callback")

//     // console.log(document.getElementById("box").value)
//     // $messageFormButton.removeAttribute('disabled')
//     document.getElementById("box").setAttribute('value',mess);
//     // document.getElementById("box").setAttribute('value',s);
//     // $messageFormInput.focus()
//     setCaretPosition(document.getElementById("box"), addAt+1);
//     if (error){
//       return console.log(error)
//     }
//     // console.log("callback")
//     // console.log(document.getElementById("box").value)
//     // console.log('your message was deliverd!')
//   })

// })
document.addEventListener('mousemove',(e)=>{
  var x = e.clientX;
  var y = e.clientY;
  socket.emit('cursor',username,room,x,y,()=>{
    // console.log('location was shared!')
    console.log("current location of currsor is shared")
  })
})


document.querySelector('#box').addEventListener('change',(e)=>{
  console.log("riddhish")
})
document.querySelector('#box').addEventListener('keydown',(e)=>{
  e.preventDefault()
  console.log(e.key)
  var addAt=document.getElementById("box").selectionStart
  const m= document.getElementById("box").value
  if (e.key=='Backspace'){
    // $messageFormButton.setAttribute('disabled','disabled')
    console.log("1st")
    var mess = [m.slice(0, addAt-1), m.slice(addAt)].join('');
  }else if(e.key=='ArrowLeft'){
    console.log("a")
    addAt-=1
    setCaretPosition(document.getElementById("box"), addAt);
    return
  }else if(e.key=='ArrowRight'){
    console.log("b")
    addAt+=1
    setCaretPosition(document.getElementById("box"), addAt);
    return
  }
  else{
    if (e.key.length==1){
    var mess = [m.slice(0, addAt), e.key, m.slice(addAt)].join('');
  }
  else{
    return
  }
  }

    socket.emit('update',mess,(error)=>{
      // console.log("callback")

      // console.log(document.getElementById("box").value)
      // $messageFormButton.removeAttribute('disabled')
      document.getElementById("box").setAttribute('value',mess);
      // document.getElementById("box").setAttribute('value',s);
      // $messageFormInput.focus()
      setCaretPosition(document.getElementById("box"), addAt+1);
      if (error){
        return console.log(error)
      }
      // console.log("callback")
      // console.log(document.getElementById("box").value)
      // console.log('your message was deliverd!')
    })


  // console.log(document.getElementById("box").value)

  // var myElement = document.getElementById('text-element');
  //       var startPosition = myElement.selectionStart;
  // console.log(mess)

})

document.querySelector('#send-location').addEventListener('click',()=>{
  // if (!navigator.geolocation){
  //   return alert('geolocation is not support is not supported by your browers')
  // }
  // $location_button.setAttribute('disabled','disabled')
  // navigator.geolocation.getCurrentPosition((position)=>{
  //   // console.log(position)
  //   // console.log(position.coords.latitude)
  //   // [
  //   const exact_position=[position.coords.latitude,position.coords.longitude]
  //   $location_button.removeAttribute('disabled')
  const mm= document.getElementById("box").value
    socket.emit('location',mm,()=>{
      // console.log('location was shared!')
      console.log("here's your output")
    })
  })

  // GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1622034918721}
  // coords: GeolocationCoordinates
  // accuracy: 215611
  // altitude: null
  // altitudeAccuracy: null
  // heading: null
  // latitude: 22.258651999999998
  // longitude: 71.1923805
//})


socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error)
    location.href='/'
  }
})

// socket.on('countUpdated',(count)=>{
//   console.log("hi your count has been updated",count)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//   console.log('Button got Clicked')
//   socket.emit('update')
// })
