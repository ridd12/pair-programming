const generateMessage = (username,text) => {
    return {
      username,
      text,
      createdAt:new Date().getTime()
    }
}
const generateLocation = (username,text) => {
    return {
      username,
      link:text,
      createdAt:new Date().getTime()
    }
}

module.exports={
  generateMessage,
  generateLocation

}
