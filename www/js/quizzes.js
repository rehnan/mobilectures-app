$(document).ready(function () { ml.quizzes.load(); });

ml.quizzes = {
	load: function () {
		ml.quizzes.quiz();
		ml.quizzes.all();
		ml.quizzes.badge_count();
		ml.quizzes.render();
		ml.quizzes.select();
		ml.quizzes.render_question(null);
		ml.quizzes.send_answer();
		ml.quizzes.add(null);
		ml.quizzes.remove();
		ml.quizzes.quizzes();
		ml.quizzes.current();
		ml.quizzes.set_current(null);
		ml.quizzes.find(0);
		ml.quizzes.update();
		ml.quizzes.badge_count();
		ml.quizzes.create_ranking(null);
		ml.quizzes.get_ranking();
	},

	quiz: function () {
		$("a[href=#quiz]").click(function (){
			if(!ml.session.user.current()) { return $.mobile.changePage('#page-sign-in'); }
			$.mobile.changePage('#page-quiz');
			ml.login.render_account();
			$("#time").html('');
			$("#listview-quizzes").html('');
			$("#poll-alternatives").html('');
			if(ml.quizzes.current() === null) {
				ml.flash.clear_this_page('#page-quiz');
				ml.quizzes.render();
			} else {
				ml.quizzes.render_question(ml.quizzes.current());
			}
		});
	},

	badge_count: function () {
		$(".badge-quizzes").text(ml.quizzes.all().length);
	},

	render: function () {

		var count_quizzes = ml.quizzes.all().length;
		$("#listview-quizzes").html('');

		if(count_quizzes > 0) {

			$.each(ml.quizzes.all(), function(index, quiz){ 
				console.log(quiz.status);
				var button_option = '';
				var image_quiz = '';
				if (quiz.status === 'open') {
					image_quiz = "<img src='img/quiz_image.png'>";
				 	button_option = "<a href='#' title='Responder Quiz' class='start_quiz ui-btn ui-btn-icon-notext ui-icon-comment ui-btn-a' data-transition='pop' data-index-quiz="+index+" data-index-question='"+JSON.stringify(index)+"'  aria-expanded='false' ></a>";
				}

				if (quiz.status === 'closed') { 
					image_quiz = "<img src='img/ranking_award.png'>";
				 	button_option = "<a href='#' title='Visualizar Estatísticas' data-quiz-id='"+quiz.id+"' data-listener-id='"+ml.session.user.current().id+"' class='get_ranking ui-btn ui-btn-icon-notext ui-icon-star ui-btn-a' data-transition='pop' data-index-quiz="+index+"  aria-expanded='false'></a>"; 
				}

				var li_quiz = "<li class='ui-li-has-alt ui-li-has-thumb ui-first-child'>" +
				"<a href='#' class='ui-btn'>" +
				image_quiz +
				"<h2>"+(index+1)+" - "+quiz.title+"</h2>" +
				"<p>"+quiz.description+"</p></a>" +
				button_option +
				"</li>";
				$("#listview-quizzes").append(li_quiz).enhanceWithin();
				//"<a href='#'  aria-haspopup='true' aria-owns='purchase' aria-expanded='true' class='ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a' title='Purchase album'></a>" +
			});
} else {
	ml.flash.info('#page-quiz', 'Mantenha-se logado para participar de quizzes!');
}
},

select: function () {
	$(document).on("vclick", ".start_quiz", function(event) {
		/* clear div listview-quizzes */
		$("#listview-quizzes").html('');
		var quiz;

			//Getting index question
			var i = $(this).data('index-question');
			var index_quiz = $(this).data('index-quiz');

			//Check by current quiz 
			if (ml.quizzes.current() === null) {
				console.log('Não existe um current_quiz selecionado!');
				quiz = ml.quizzes.find(i);
				quiz.index = index_quiz;
				ml.quizzes.set_current(quiz);
				//create ranking here call method
				ml.quizzes.create_ranking(quiz);
				ml.flash.clear_this_page('#page-quiz');
			} else {
				console.log('Já existe um current_quiz selecionado!')
				quiz = ml.quizzes.current();
				quiz.index = index_quiz;
			} 

			

			//Render question
			ml.quizzes.render_question(quiz);

			return true;
		});
},

render_question: function (quiz) {

	$("#quiz-info").html('')
	$("#quiz-question").html('')
	$("#quiz-alternatives").html('');

	if(quiz && quiz.questions && quiz.questions.length > 0) {

		var question = quiz.questions.shift();
		var header_title = "<span><center><b>Título: </b>"+quiz.title+"</center></span>";
		
		$("#quiz-info").html(header_title+"<input type='hidden' name='quiz' value='"+quiz.id+"'><input type='hidden' name='quizquestion' value='"+question.id+"'><input type='hidden' name='listener' value='"+ml.session.user.current().id+"'><input type='hidden' name='correct_alternative' value='"+question.correct_alternative+"'><input type='hidden' name='pointing' value='"+question.points+"'><input type='hidden' name='index' value='"+quiz.index+"'>");
		$("#quiz-question").html("<p>"+question.description+"</p><hr>").enhanceWithin();
		$("#quiz-alternatives").html('');

		$.each(question.alternatives, function(index, alternative){ 
			var alt = "<label for='"+index+"'>"+alternative+"</label>" +
			"<input type='radio' name='alternative' value="+index+" id='"+index+"'>";
			$("#quiz-alternatives").append(alt).enhanceWithin();
		});

		$("#quiz-alternatives").append("<button id='send_answer_quiz'>Responder Quiz </button>").enhanceWithin();
		
		//Start timer to answer question...
		ml.timer.stop();
		
		console.log(question.time);
		console.log(ml.timer.current());
		if (ml.timer.current() === null) { 
			ml.timer.set_timer(question.time);
		} else {
		    ml.timer.set_timer(ml.timer.current());
		}
		ml.timer.start(true);
	} else {
		ml.timer.reset();
		ml.timer.stop();
		ml.quizzes.set_current(null);
		ml.quizzes.render();
		if (quiz !== 'done') { ml.flash.success('#page-quiz', 'Quiz finalizado com sucesso!'); }
	}
},


send_answer: function () {
	$('#form-quiz').submit(function() {
		console.log('Sending answer...');
		var form = $(this).serializeJSON();

		form.alternative = Number(form.alternative);
		form.correct_alternative = Number(form.correct_alternative);
		form.pointing = Number(form.pointing);
		form.listener = ml.session.user.current().id
		//Stopping timer
		ml.timer.stop();
		form.time = ml.timer.current();

		//console.log('Pontos: '+(Number(form.points) - (ml.timer.current()/100));
		console.log(form);
		var url = ml.config.url + '/api/quiz_answers'

		socket.post(url, form, function (data, resp) {

			ml.flash.clear_this_page('#page-quiz');
			if(data.errors) {
				if(data.errors.alternative) {
					//Start timer
					(ml.timer.current() > 0) ? ml.timer.start(true) : ml.timer.stop();
					console.log('Erro - Tempo continua...');
					ml.flash.error('#page-quiz', data.errors.alternative[1]);
				} else {
					ml.timer.stop();
					ml.timer.reset();
					var quiz = ml.quizzes.current();
					quiz.status = 'closed';
					ml.quizzes.update(quiz, form.index);
					console.log('Tempo interrompido - Quiz Encerrado!!');
					console.log(data.errors);
					ml.flash.error('#page-quiz', data.errors);
					ml.quizzes.set_current(null);
					return ml.quizzes.render_question('done');
				}
				return false;
			}

			ml.timer.reset();
			ml.timer.stop();

			ml.flash.success('#page-quiz', 'Resposta enviada com sucesso!');
			var quiz = ml.quizzes.current();
			console.log(quiz.questions.length);
			quiz.questions.shift();
			//Mudando status do quiz caso seja a última questão renderizada
			if (quiz.questions.length === 0) { 
				quiz.status = 'closed';
				ml.quizzes.update(quiz, form.index);
			}
			ml.quizzes.set_current(quiz);
			
			return ml.quizzes.render_question(ml.quizzes.current());
		});

		return false;
	});
},

add: function (quiz) {
	ml.session.quizzes.add(quiz); 
},

quizzes: function () {
	return ml.session.quizzes.all(); 
},

remove: function () {
	ml.session.quizzes.remove(); 
}, 

current: function () {
	return ml.session.quizzes.current(); 
},

set_current: function (value) {
	return ml.session.quizzes.set_current(value); 
},

all: function () {
	return ml.session.quizzes.all(); 
},

find: function (index) {
	return ml.session.quizzes.find(index); 
},

create_ranking: function (quiz) {
	if(!quiz) { return false; }
	var url = ml.config.url + '/api/quiz/ranking'
	socket.post(url, {quiz: quiz.id, listener: ml.session.user.current().id}, function (data, jwres) {
        console.log(data);
	});
},

get_ranking: function () {

	$(document).on("click", ".get_ranking", function (event) {
		console.log('Get a statistics, please!');

		var quiz_id = $(this).data("quiz-id");
		var listener_id = $(this).data("listener-id");
		var listener = ml.session.user.current();
		var url = ml.config.url + '/api/quiz/'+quiz_id+'/ranking/'+listener_id;

		socket.get(url, {listener:listener},function (data, jwres) {
	        console.log(data);
	        $.mobile.changePage('#page-ranking');
			ml.login.render_account();
			ml.ranking.render(data);
		});
	});
},

update: function(quiz, index) {
	return ml.session.quizzes.update(quiz, index); 
}

};