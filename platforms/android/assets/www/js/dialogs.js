$(document).ready(function () { ml.dialogs.load(); });

ml.dialogs = {

	load: function () {
		ml.dialogs.info(null, null);
	},

	info: function (header, message) {
		if(header === null) { return false; }
		$("#dialog-header").html(header).text();
		$("#dialog-message").html(message).text();
		$.mobile.changePage('#dialog-info');

		$('#dialog-close').click(function() {
			$("#dialog-info").dialog("close");
		});
	}
};