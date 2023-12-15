var  chatBox= document.getElementById("chatBox")
 console.log("script loaded");
socket = io('http://localhost:3100')


var sendBtn =document.getElementById("sendBtn");


sendBtn.addEventListener("click",sendMessage)


function sendMessage(e) {
    console.log(socket.id);
    socket.id="wecslkcnsc"
    console.log(socket.id);
    e.preventDefault()
    const input = document.getElementById('messageBox')
    if (input.value) {
        socket.emit('send-message', input.value)

        chatBox.innerHTML+=`<div id="sender" class="d-flex flex-row justify-content-end mb-4">
        <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
          <p class="small mb-0">${input.value}</p>
        </div>
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
          alt="avatar 1" style="width: 45px; height: 100%;">
      </div>`

      const isChatContentOverflowing = chatBox.scrollHeight > chatBox.clientHeight;

      if (isChatContentOverflowing) {
          // Scroll to the bottom
          chatBox.scrollTop = chatBox.scrollHeight;
      }
        input.value = ""
    }
    input.focus()
    
}



// Listen for messages 
socket.on("send-message", (data) => {
    
    chatBox.innerHTML+=` <div id="reciver"  class="d-flex flex-row justify-content-start mb-4">
    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
      alt="avatar 1" style="width: 45px; height: 100%;">
    <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
      <p class="small mb-0">${data}</p>
    </div>
  </div>`

  const isChatContentOverflowing = chatBox.scrollHeight > chatBox.clientHeight;

    if (isChatContentOverflowing) {
        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
  

})