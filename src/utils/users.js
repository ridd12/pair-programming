const users=[]


const addUser = ({id, username,room})=>{
  username=username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  //validate the data
  if(!username || !room){
    return {
      error:'Username and room are required!'
    }
  }
  //Check for exixting username
  const existingUser= users.find((user)=>{
    return room===user.room && user.username === username
  })

  //validatade Username
  if (existingUser){
    return {
      error:'Username is in use!'
    }
  }

  //Store Username

  const user={id,username,room}
  users.push(user)
  return { user }
}

const removeUser=(id)=>{
  const index=users.findIndex((user)=>{
    return user.id===id
  })
  if (index!==-1){
    //splice is used to remove a element from a arrary by using its index number
    //in return it gives us a array because more than one users can also be removed but in this case we are removing just one so [0]
    return users.splice(index , 1)[0]
  }
}

const getUser=(id)=>{
  return users.find((user)=> user.id===id)
}

const getUsersInRoom=(room)=>{
  return users.filter((user)=>user.room===room)
}

module.exports={
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}



//Testing the above code
// addUser({
//   id:22,
//   username:'   ridd    ',
//   room:'  gg   '
// })
//
//
// addUser({
//   id:12,
//   username:'   pidd    ',
//   room:'  ggg   '
// })

// console.log(users)

// const userList=getUsersInRoom('g')
//
// console.log(userList)


//
// console.log(removedUser)
// console.log(users)
