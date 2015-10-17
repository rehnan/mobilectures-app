$(document).ready(function () { ml.timer.load(); });

ml.timer = {

   load: function () {
   		ml.timer.storage = window.sessionStorage;
   		ml.timer.counter = 0;
         ml.timer.set_timer(null); 
   		ml.timer.decrementTimer();
   		ml.timer.current();
   		ml.timer.start(false);
   		ml.timer.reset();
   		ml.timer.stop();
   },

   set_timer: function (start_time) {
      if(!ml.session.user.current() && !start_time) { return false; }
         $("#timer").html('');
         var input_time = "<center><label for='time' class='ui-btn ui-icon-clock ui-btn-icon-left'><span id='time' style='font-size: 17px;'><b> "+start_time+" segundo(s)... </b></span></label></center>";
         $("#timer").append(input_time).enhanceWithin();
         ml.timer.storage.setItem('timer_'+ml.session.user.current().email, JSON.stringify(start_time));
   },

   decrementTimer: function () {
   		if(!ml.session.user.current()) { return false; }
   		var value = JSON.parse(ml.timer.storage.getItem('timer_'+ml.session.user.current().email));
   		value--;
   	   ml.timer.storage.setItem('timer_'+ml.session.user.current().email, JSON.stringify(value));
   },

   current: function () {
   		if(!ml.session.user.current()) { return false; }
   		return JSON.parse(ml.timer.storage.getItem('timer_'+ml.session.user.current().email));
   }, 

   start: function (boolean) {
   		if(!ml.session.user.current()) { return false; }
   		if(boolean) {
      		ml.timer.counter = setInterval(function () {
                  console.log('Iniciando Timer...');  
         			//Limit seconds timer
         			if(ml.timer.current() > 0) {
                     ml.timer.decrementTimer();
                     console.log('Decrement Timer...'+ ml.timer.current());
                     var time = (ml.timer.current());
                     $("#time").html("<b> "+time+" segundo(s)... </b>").enhanceWithin();
         			} else {
                     console.log('O tempo chegou ao limite');
                     $("#time").html("<b> Tempo esgotado... </b>").enhanceWithin();
                     ml.timer.stop();
                     return clearInterval(ml.timer.counter);
                  }
            
   			   }, 1000);
   		} 
   },

   stop: function () {
   	    clearInterval(ml.timer.counter);
   },

   reset: function () {
   		if(!ml.session.user.current()) { return false; }
         console.log('Set null to timer: '+ml.timer.current());
         $("#timer").html('');
         ml.timer.storage.setItem('timer_'+ml.session.user.current().email, JSON.stringify(null));
   },
   
}