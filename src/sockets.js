import React from 'react';


var socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/room_name_igor/");
socket.onopen = ()=> console.log("start")
socket.onclose = ()=> console.log("close")
socket.onerror = (event)=> console.log("error" + event.message)
socket.onmessage = (event)=> console.log("message" + event.data)


export default function TEXT() {
    const [text, setText] = React.useState("");
    function onClick() {
        socket.send(text)
    }
    return(
        <div>
            <input value={text} onChange={(event)=>setText(event.target.value)}></input><br/>
            <button onClick={onClick}>send</button>
        </div>
    )
}