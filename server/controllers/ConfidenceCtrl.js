var currentConfidence = {};

module.exports = {
  handleSubmitConfidence:function(socket, io, obj){

      obj['socketId'] = socket.id;

      io.to('instructors').emit('report confidence single', obj);

      if (currentConfidence[obj.objective_id]){
        currentConfidence[obj.objective_id][socket.id] = obj.value;
      }else{
        var temp = {};
        temp[socket.id] = obj.value;
        currentConfidence[obj.objective_id] = temp;
      }


  },
  handleInstructorLogin:function(socket, obj){
    console.log("Instructor Logging In");
    socket.emit("report confidence", currentConfidence);
    socket.join('instructors');

  }

}
