var socket = io.connect(ml.config.url);

socket.on("connect", function () {
	ml.loader.hide();
	console.log("Connection Success!");

	socket.on('disconnect', function () {
		console.log('Server is died!')
		//Stop timer to answer questions
		console.log('Stop Timer! wainting for reconnection')
		ml.timer.stop();
		ml.loader.show();
		$("#msg-loading").html("<strong> Aguarde... <br> Conexão perdida... </strong>").text();
	});

	socket.on('reconnecting', function () {
		console.log('Trying Reconnecting...') 
		$("#msg-loading").html("<strong> Aguarde... <br> Tentando uma reconexão com o servidor </strong>").text();
	});

	socket.on('reconnect', function () {
		var url = ml.config.url + '/api/listeners/join';
		if(ml.session.user.current()) {
			var auth = {};
			auth.user = ml.session.user.current();
			auth.session_id = ml.session.user.current().session_key;
			socket.post(url, auth, function (data, jwres) {
	            if (data.authorization == "authorized") {
	               var header = "Sessão " + data.session.name;
	               console.log('Logged!!');
	               //Start timer if timer > 0
	               console.log('Start Timer! Reconnection Success!');
	               (ml.timer.current() > 1) ? ml.timer.start(true) : ml.timer.stop();

	               $("#msg-loading").html("<strong> Aguarde... <br> Reconexão efetuado com sucesso! </strong>").text();
	            } else if (data.error) {
	               console.log('Erro Logged!! - Deslogando...');
	               ml.timer.stop();
	               ml.timer.reset();
	               var url = ml.config.url + "/api/listeners/leave";
			       socket.get(url, {}, function (data, jwres) {
			            ml.session.user.destroy();
			            $.mobile.changePage('#page-sign-in');
			            ml.flash.info("#page-sign-in", "Entre com seu login novamente!");
			         });
	            }
	      	});
		}
	
		ml.loader.hide();
	});
});

socket.on('error', function (data) {
	console.log('Server is alive?');
	ml.loader.show();
	$("#msg-loading").html("<strong> Aguarde... <br> Tentando uma conexão com o servidor </strong>").text();
});

socket.on('welcome-msg', function(message){
	ml.flash.success("#page-logged-1", message);
});

socket.on('polls-receive', function(poll){
	console.log('Pollll');
	ml.polls.add(poll)
	ml.polls.badge_count();
	ml.polls.render();
});

socket.on('quizzes-receive', function(quiz){
	console.log('Quizzzz');
	ml.flash.clear_this_page('#page-quiz');
	ml.quizzes.add(quiz);
	ml.quizzes.badge_count();
	//create ranking here call method
	ml.quizzes.create_ranking(quiz);
	ml.quizzes.render();
});



