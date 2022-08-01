
/*Animation in chat-box on reloading*/
$( '.friend-drawer--onhover' ).on( 'click',  function() {
  
    $( '.chat-bubble' ).hide('slow').show('slow');
    
  });
  
/* Set the width of the slidebar to 250px and the left margin of the page content to 250px */
function toggleNav() {
  const wid=document.getElementById("mySlidebar").style.width;
  if(wid=="0px"){
    $('.attendees').css("color","black");
    document.getElementById("mySlidebar").style.width = "200px";
     document.getElementById("main-side").style.marginRight = "250px";
  }else{
    $('.attendees').css("color","white");
    document.getElementById("mySlidebar").style.width = "0";
    document.getElementById("main-side").style.marginRight = "0";
  }
  }
  
  /* Set the width of the slidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    $('.attendees').css("color","white");
    document.getElementById("mySlidebar").style.width = "0";
    document.getElementById("main-side").style.marginRight = "0";
  }

/* Start the call by redirecting to link of the call*/
  function startCall(){                                   
    window.location.href = "/"+room_i;
  }


/*Copy the link user is currently on (meeting chat room) to the clipboard for easy sharing*/
var $temp = $("<input>");
var $url = $(location).attr('href');
const copy_link=()=>{
$("body").append($temp);
$temp.val($url).select();
document.execCommand("copy");
$temp.remove();
$('.invite').css("color","green");
}

/*Change color of the invite icon upon hover out*/
const outFunc=()=>{
  $('.invite').css("color","white");
}