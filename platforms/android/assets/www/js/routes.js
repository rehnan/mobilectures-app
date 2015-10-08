$(document).ready(function () { ml.routes.load(); });

ml.routes = {

   load: function () {
   	//ml.routes.unlogged();
      //ml.routes.logged();
      //ml.routes.pageinit();
   	//ml.routes.beforeAction();
      // ml.routes.sign_in();
      // ml.routes.sign_up();
      // ml.routes.index();
      // ml.routes.doubts();
      // ml.routes.page_not_found();
   },

   unlogged: function (page) {
      var allowed_to_unlogged = ["#page-sign-in", "#page-sign-up"];
      if(jQuery.inArray(page, allowed_to_unlogged) === -1){
          return false;
      } 
      return true;
   },

   logged: function (page) {
       var allowed_to_logged = ["#doubt", "#page-logged-1"];
       if(jQuery.inArray(page, allowed_to_logged) === -1){
           return false;
      } 
      return true;
   },

   pageinit: function () {
      (ml.session.getItem("authorization") === 'true') ? $.mobile.changePage(ml.routes.index()) : $.mobile.changePage(ml.routes.sign_in());
   },

   beforeAction: function () {
      //"div[data-role='page']"
      $(document).bind("pagebeforechange", function ( event , data ) {

         if(typeof data.toPage !== "object" ) {
      
            var arrayUrl = data.absUrl.split("#");
            var page = "#"+arrayUrl[1];

            var pattern =  /#.*[a-z]/i ;
            if(ml.session.getItem("authorization") === 'true') {
               if(ml.routes.logged(page) === true) {
                  console.log('Online '+page);
                  return true;
               }
               return false; 
            } else if (ml.session.getItem("authorization") === 'false') {
                  if(ml.routes.unlogged(page) === true) {
                  console.log('Offline');
                  return true;
                  } 
                  return false;
            } 
            return false;
         }//If is object
         return false;
         
		});
   },

   sign_in: function () {
   	return '#page-sign-in';	
   }, 

   sign_up: function () {
   	return '#page-sign-up';
   },

   index: function () {
   	return '#page-logged-1';
   },

   doubts: function () {
   	return '#doubt';
   },

   page_not_found: function () {
      return '#page-404';
   }
}