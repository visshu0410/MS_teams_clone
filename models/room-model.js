var mongoose = require("mongoose");
var roomSchema = new mongoose.Schema({
    title: String,
   // id : String,
    chats: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Chat"
      }
   ],
   attendees:[
     {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      }
   ],
    created:  {type: Date, default: Date.now}
});

module.exports = mongoose.model("Room", roomSchema);
