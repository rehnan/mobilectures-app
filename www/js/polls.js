$(document).ready(function () { ml.polls.load(); });

ml.polls = {
	load: function () {
		ml.polls.poll();
		ml.polls.render();
		ml.polls.add(null);
		ml.polls.remove();
		ml.polls.polls();
		ml.polls.current();
		ml.polls.badge_count();
		ml.polls.notify();
		ml.polls.send_answer();
	},

	poll: function () {
		$("a[href=#poll]").click(function (){
			if(!ml.session.user.current()) { return $.mobile.changePage('#page-sign-in'); }
			$.mobile.changePage('#page-poll');
			ml.login.render_account();
			ml.polls.render();
		});
	},

	notify: function() {
		//Modificar label e gerar uma notificação de nova enquete com o plugin phonegap
		
	},

	badge_count: function () {
		$(".badge-polls").text(ml.session.polls.all().length);
	},

	render: function () {
		ml.flash.clear_this_page('#page-poll');
		if(ml.session.polls.all().length > 0) {

			var poll = ml.polls.current();

			$("#poll-info").html("<span><center><b>Título: </b>"+poll.title+"</center></span>").enhanceWithin();
			$("#poll-question").html("<p>"+poll.question+"</p><hr>").enhanceWithin();
			$("#poll-alternatives").html('');

			//(poll.choice_multiple) ? poll.type_input = 'checkbox' : poll.type_input = 'radio'
			if(poll.choice_multiple) {
				$.each(poll.alternatives, function(index, alternative){ 
					var alt = "<label for='"+index+"'>"+alternative+"</label>" +
					"<input type='checkbox' name='alternative-"+index+"' value="+index+" id='"+index+"'>";
					$("#poll-alternatives").append(alt).enhanceWithin();
				});
			} else {
				$.each(poll.alternatives, function(index, alternative){ 
					var alt = "<label for='"+index+"'>"+alternative+"</label>" +
					"<input type='radio' name='alternative' value="+index+" id='"+index+"'>";
					$("#poll-alternatives").append(alt).enhanceWithin();
				});
			}

			$("#poll-alternatives").append("<button id='send_answer'>Responder Enquete </button>").enhanceWithin();

		} else {
			$("#poll-info").html('')
			$("#poll-question").html('')
			$("#poll-alternatives").html('');

			ml.flash.info('#page-poll', 'Você não possui enquetes para responder!');
		}
	},

	add: function (poll) {
		ml.session.polls.add(poll); 
	},

	polls: function () {
		return ml.session.polls.all(); 
	},

	remove: function () {
		ml.session.polls.remove(); 
	}, 

	current: function () {
		return ml.session.polls.current(); 
	},

	send_answer: function () {
		$('#form-poll').submit(function() {

			var form = $(this).serializeJSON();
			var data = {};
			data.poll = ml.polls.current().id;
			data.alternatives = Object.keys(form).map(function(k) { return Number(form[k]) });

			var url = ml.config.url + '/api/poll_answers'
			
			socket.post(url, data, function (data, resp) {
				
				if(data.errors) {
					if(data.errors.alternatives) {
						ml.flash.error('#page-poll', data.errors.alternatives);
					} else {
						ml.dialogs.info('Informação!', '<center> '+data.errors+' </center> <br><br>');
						ml.polls.remove();
						ml.polls.badge_count();
						ml.polls.render();	
					}
					return false;
				}
				ml.flash.clear_this_page('#page-poll');
				ml.polls.remove();
				ml.polls.badge_count();
				ml.polls.render();
				ml.flash.success('#page-poll', 'Resposta de enquete enviada com sucesso!');
				return true;
			});
			return false;
		});
	}
}