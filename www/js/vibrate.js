$(document).ready(function () { app.vibrate.load(); });

app.vibrate = {

   load: function () {
      app.vibrate.on();
   },

   on: function (time) {
   	if(!time) { return false; }
   	alert('Hiii!');
   }
}
