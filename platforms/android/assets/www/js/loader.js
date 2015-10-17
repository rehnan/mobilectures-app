$(document).ready(function () { ml.loader.load(); });

ml.loader = {
	load: function () {
		ml.loader.show();
		ml.loader.hide();
		ml.loader.button();
	},

	show: function () {
	    var $this = $("#show-page-loading-msg");
	        msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
	        textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
	        textonly = !!$this.jqmData( "textonly" );
	        html = $this.jqmData( "html" ) || "";

	    $.mobile.loading( "show", {
	            text: msgText,
	            textVisible: textVisible,
	            textonly: textonly,
	            html: html
	    });
	},

	hide: function () {
		$.mobile.loading( "hide" );
	},

	button: function(id, value, enabled) {
		if(!id) { return false; }
		if(enabled) {
			console.log('Habilitando..');
			$('#'+id).removeAttr("disabled", "disabled").enhanceWithin();
			$('#'+id).html(value).enhanceWithin();
		} else {
			console.log('Desabilitando..');
      		$('#'+id).attr("disabled", "disabled").enhanceWithin();
      		$('#'+id).html("Enviando...").enhanceWithin();
		}
		return true;
	}
};