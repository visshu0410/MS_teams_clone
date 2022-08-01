const socket =io('/')

const videoGrid = document.getElementById('video-grid')

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
var peer = new Peer(undefined ,{
  path: '/peerjs',
  host: '/' ,
  port: 443
} )

if(username=="guest-user"){                                                 //If someone isn't signed in and enters the meeting, ask for a username, if NULL then give guest-user
  if((username = prompt('What is your name?',"guest-user"))){

  }else{
    username="guest-user"
  }
  
}

navigator.mediaDevices.getUserMedia({                                       //Getting audio and video from the device
  video: true,
  audio: true
}).then(stream => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);                                     //adding own stream on the video-grid
        peer.on('call', call=>{
        call.answer(stream)                                                  //calling user and sending own video as answer
        const video = document.createElement('video')                        //adding video stream recieved from other person
            call.on('stream' , userVideoStream =>{
              addVideoStream(video , userVideoStream)
            })
        })

        socket.on('user-connected' , (userId)=>{                             //Connecting the user
        // connectToNewUser(userId , stream);
        setTimeout(connectToNewUser,1000,userId,stream)
        })

        let text = $('input')                                                //Taking input from the chat box on enter and if its non-null 
        $('html').keydown((e) =>{
          if(e.which==13 && text.val().length!==0){                            
            var data={
              message:text.val(),
              username:username,
              user_id:user_id
            }
            socket.emit('message' , data);                                    // then announce the message to all other users
            text.val('')
          }
        })
        
        socket.on('createMessage' ,data=>{                                    //recieving that a message is being announced by someone
          $('.messages').append('<strong>'+data.username+'</strong>'+'</br>'+data.message+'</br>')   //append message in the chat-box
          scrollToBottom()
        
        })

        socket.on("will_draw", (data)=> {                                     //Function to recieve data that someone has drawn on the whiteboard
          drawing(data);                                                      //Draw using the same data on own whiteboard
        });
        
        socket.on("clear_wb",()=>{                                            //Function announcing someone cleard the whiteboard
          ClearWb();                                                          //Clearing own whiteboard
        })

  })

  socket.on('user-disconnected', userId => {                                  //Disconnecting from the call
    if (peers[userId]) peers[userId].close()
  })

  peer.on('open' , id=>{                                                      //Making connection
  socket.emit('join-room', ROOM_ID, id);
  })



  const connectToNewUser= (userId , stream)=>{                                //Function to connect to new user
    const call = peer.call(userId , stream)
    const video = document.createElement('video')

    call.on('stream' , userVideoStream =>{
      addVideoStream(video , userVideoStream)
    })

    call.on('close', () => {                                                  //If a user disconnected, so remove it's video
      video.remove()
    })
  
    peers[userId] = call                                                      //Maintaing data of all the users
    
  }

  const addVideoStream=(video,stream)=>{                                      //Functoin to add video stream, create an video element and set its source to stream 
    video.srcObject=stream;
    video.addEventListener('loadedmetadata' , ()=>{
      video.play();
    })
    videoGrid.append(video);                                                  //then append it at video-grid
    
  }

const scrollToBottom=()=>{                                                   //To ensure that chatbox scrolls on overflowing
  var d=$('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}

//To Mute and Unmute your Audio
const muteUnmute=()=>{
  const enabled=myVideoStream.getAudioTracks()[0].enabled;  //here [0] represents your own audio
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();                                                      //change the colour of the mute button and name it unmute button
  }else{
    setMuteButton();                                                        //Changing from unkmute to mute button
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton=()=>{
  const html=`
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
`
document.querySelector('.main__mute__button').innerHTML=html;
}



const setUnmuteButton=()=>{
  const html=`
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
`
document.querySelector('.main__mute__button').innerHTML=html;
}


//To Play and stop your video
const playStop=()=>{
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()                                                                    //Change the stop button to play button
  }else{
    setStopVideo()                                                                    //Change the play button to stop button
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo=()=>{
  const html=`<i class="fas fa-video"></i>
  <span>Stop Video</span>`
  document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo=()=>{
  const html=`<i class=" stop fas fa-video-slash"></i>
  <span>Video</span>`
  document.querySelector('.main__video__button').innerHTML = html;
}

const leavemeet=()=>{                                                               //If someone clicks on leave button, redirect to room chat page
  window.location.href = "/room/"+ROOM_ID;
}
