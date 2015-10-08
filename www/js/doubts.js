$(document).ready(function () { ml.doubts.load(); });

ml.doubts = {

  load: function () {
    ml.doubts.bool();
    ml.doubts.send_doubt();
    ml.doubts.doubt();
    ml.doubts.append_doubt();
    ml.doubts.formatDate();
 },

 doubt: function () {
  $("a[href=#doubt]").click(function (){
    if(!ml.session.user.current()) { return $.mobile.changePage('#page-sign-in'); }

    $.mobile.changePage('#page-doubt');
    ml.login.render_account();
    var url = ml.config.url + "/api/doubts";
    socket.get(url, function (data, jwres) {
         //console.log(data);
         //console.log(jwres);
         $('#doubts-table tbody').empty();
         var doubts = data.doubts;
         $.each(doubts, function(index, doubt){
           //console.log(doubt);
           $('#doubts-table tbody').append("<tr><td>"+(index+1)+"</td><td>"+doubt.description+"</td><td>"+ml.doubts.formatDate(doubt.createdAt)+"</td><td>"+ml.doubts.bool(doubt.answered)+"</td></tr>").enhanceWithin();
        })
      });
 });
},

append_doubt: function (index, doubt) {

},

bool: function(bool) {
 return (bool) ? 'Sim' : 'Não';
},


formatDate: function(date) {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
},

  send_doubt: function() {
     $("#form-doubt").submit(function(){
      var params = $(this).serializeJSON();
      params.doubt.listener = ml.session.user.current().id;
      params.doubt.session = ml.session.user.current().logged_room;
      console.log(params);
      var url = ml.config.url + "/api/doubts";
             //alert(JSON.stringify(params));

             socket.post(url, params, function (data, jwres) {
                var status_code = jwres.statusCode;
                //Append new dount in table
                //append_doubt(data.doubt, data.index);
                //console.log(data.doubt);
                
                if (data.errors) {
                   ml.flash.error('#page-doubt', 'Dados incorretos!');
                   ml.forms.showErrors('#form-doubt', data.errors, 'doubt');
                } else if(status_code == 200) {
                   var doubt = data.doubt;
                   var index = data.index;

                   $('#doubts-table tbody').append("<tr><td>"+index+"</td><td>"+doubt.description+"</td><td>"+ml.doubts.formatDate(doubt.createdAt)+"</td><td>"+ml.doubts.bool(doubt.answered)+"</td></tr>").enhanceWithin();
                   //console.log(data.doubt.id);
                   ml.flash.success('#page-doubt', 'Dúvida enviada com sucesso! '+data.doubt.id);
             //ml.flash.clear();
             ml.forms.clear('#form-doubt');
             //Redireciona $.mobile.changePage('#page-sign-in');
          }
       });
      return false;
   });
}
}
