const socket = io();
// Necessary variables are declared here.
const messagearea = document.querySelector(".message__area");
const textarea = document.querySelector("#textarea");
var audio = new Audio('../ting.mp3');
let namee;

// Used prompt method to get the name of the user
namee = prompt('Enter your name to join');

// When user press the enter key it will listen that event and emit send.
textarea.addEventListener('keyup', (e)=>{
    if(e.key == 'Enter'){
        sendMessage(e.target.value);
        socket.emit('send', e.target.value);
        e.target.value = '';
    }
})

// function written to append messages to the textarea a new div will get created here and added to textarea.
function appendMessage(msg, type){
    let maindiv = document.createElement('div');
    maindiv.classList.add(type, 'message');
    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    maindiv.innerHTML = markup;
    messagearea.append(maindiv);
    if(type=='incoming'){
        audio.play();
    }
}

// function written to send messages to users
function sendMessage(message){
    let msg = {
        user: namee,
        message: message.trim()
    }
    //append the message
    appendMessage(msg, 'outgoing');
}

// New user joind event fired here.
socket.emit('new-user-joined', namee);

// It will listen which user joind and using append method broadcast the message to all the users.
socket.on('user-joined', namee =>{
    const joined = {
        user: namee,
        message: 'Joined the chat'
    }
    appendMessage(joined, 'outgoing');
})

// When receive event will get fired this will listen it and using append method will send message to all the users.
socket.on('receive', data =>{
    let receiveddata = {
        user: data.name,
        message: data.message
    }
    appendMessage(receiveddata, 'incoming');
})

// Same when left event will get fired it will send message to all the users.
socket.on('left', namee =>{
    const leave = {
        user: namee,
        message: 'Left the chat'
    }
    appendMessage(leave, 'incoming');
})
