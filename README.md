# Videoall
Welcome to Videoall, a video calling app. </br>
Link to the app hosted on Heroku : https://videoall.herokuapp.com/  </br>
Learn more : https://drive.google.com/file/d/1gdD2hxhzJvc1LURlWYWXeg-8YTEgZvwi/view?usp=share_link </br>
<strong>The Major Technologies used include:</strong> </br>
<ul>
<li>NodeJS</li>
<li>WebRTC</li>
<li>MongoDb</li>
<li>ejs and javascipt for front end</li>
</ul>
</br>

<strong>To run Videoall on your local machine</strong>,  (NOTE : You must have NodeJS installed on your computer)
<ol>  </br>
<li>Clone or download the code from repository</li>

<li>Run 
  
```
npm init
```
  
</li>
<li>Run
  
```
npm install
```
  
 </li>
<li>Change the line at /public/js/script.js at line 12 from
  
```
port: 443
```
  
to 
  
```
port:3030
```
  
</li>
<li>
Run 
  
```
node server.js
```
  
</li>
<li>
You can now visit port 3030 of your local machine to view running Videoall locally :)
</li>
</ol>
</br>
NOTE: This currently runs only on https on Heroku.
