$(document).ready(function () { ml.login.load(); });

ml.login = {

   load: function () {
      ml.login.sign_up();
      ml.login.sign_in();
      ml.login.sign_out();
      ml.login.render_account();
   },

   sign_up: function () {
      $('#form-sign-up').submit(function() {

         var data = $(this).serializeJSON();
         var url = ml.config.url + '/api/listeners'

         $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            data: data,
            success: function(data, status) { 
               ml.forms.clear('#form-sign-up');
               ml.flash.info('#page-sign-in', 'Conta criada com sucesso!');
               $.mobile.changePage('#page-sign-in');
            },
            error: function(data, status) {
               //console.log(data.responseJSON);
               ml.flash.error('#page-sign-up', 'Dados incorretos!');
               var errors = data.responseJSON.errors;
               ml.forms.showErrors('#form-sign-up', errors, 'user');
            },
         });

         return false;
      });

   },

   sign_in: function () {

      $('#form-sign-in').submit(function() {
         $('#btn_login').attr("disabled", "disabled").enhanceWithin();
         $('#btn_login').html("Efetuando Login...").enhanceWithin();

         var account = $(this).serializeJSON();
         var url = ml.config.url + '/api/listeners/join';

         socket.post(url, account , function (data, jwres) {
            $('#btn_login').removeAttr("disabled", "disabled").enhanceWithin();
            $('#btn_login').html("Login").enhanceWithin();
            if (data.authorization == "authorized") {
               
               
               data.listener.session_key = data.session.key;
               ml.session.user.save(data.listener);
               ml.login.render_account();
               var header = "Sessão: " + data.session.name;

               if(!ml.session.polls.all()) { ml.session.polls.new(); } 
               ml.polls.badge_count();

               if(!ml.session.quizzes.all()) { ml.session.quizzes.new(); } 
               ml.quizzes.badge_count();
               
               $('#page-logged-1').find('div[data-role="header"] h1').html(header);
               ml.forms.clear('#form-sign-in');
               $.mobile.changePage('#page-logged-1');
            } else if (data.error) {
               ml.flash.error("#page-sign-in", data.error.message);
            }
         });

         return false;
      });
   },

   sign_out: function () {
      $("a[href=#sign-out]").click(function (){
         //console.log(this);
         var url = ml.config.url + "/api/listeners/leave";

         socket.get(url, {}, function (data, jwres) {
            //console.log(data);
            //console.log(jwres);
            ml.session.user.destroy();
            $.mobile.changePage('#page-sign-in');
            ml.flash.info("#page-sign-in", "Obrigado por participar desta sessão!");
         });

         return false;
      });
   },

   render_account: function () {
      if(!ml.session.user.current()) { return false; }
      $(".avatar").attr('src', ml.session.user.current().avatar).enhanceWithin();
      $(".span_user_name").html(ml.session.user.current().name).enhanceWithin();
      $(".span_user_email").html(ml.session.user.current().email).enhanceWithin();
   }
}
