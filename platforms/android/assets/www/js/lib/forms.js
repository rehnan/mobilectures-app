ml.forms = { 

   clear: function (form) {
      var obj = $(form);
      obj.find('.form-group').removeClass('has-error');
      obj.find('span').remove();
      obj[0].reset();
   },

   showErrors: function(form, errors, model) {
      var obj = $(form);
      obj.find('.form-group').removeClass('has-error');
      obj.find('span').remove();

      $.each(errors, function (input, msgs){
         var id = "#"+model+"_" + input;
         $.each(msgs, function (index, msg)  {
            var input_obj = obj.find(id).closest('.form-group');
            input_obj.addClass("has-error");
            var span = "<span>"+msg+"</span>"
            input_obj.append(span);
         });
      });
   }
}
