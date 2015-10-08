$(document).ready(function () { ml.ranking.load(); });

ml.ranking = {
	load: function () {
		ml.ranking.render();
		ml.ranking.back();
	},

	render: function (datas) {
		//$("a[href=#ranking]").click(function (){
			if(!ml.session.user.current() || !datas) { return $.mobile.changePage('#page-sign-in'); }
			$.mobile.changePage('#page-ranking');
			ml.login.render_account();
			$("#ranking-info").html('');
			$("#ranking-info").append("<tr><td><b>Quiz: </b>"+datas.quiz.title+"</td></tr>");
			$("#ranking-info").append("<tr><td><b>Nome: </b>"+datas.listener.name+"</td></tr>");
			$("#ranking-info").append("<tr><td><b>Colocação: </b>"+datas.place+"</td></tr>");
			$("#ranking-info").append("<tr><td><b>Pontuação: </b>"+datas.pointing+"</td></tr>");
			$("#ranking-info").append("<tr><td><b>Acertos: </b>"+datas.hits+"/"+datas.quiz.questions.length+"</td></tr>");
			
			$("#ranking-list").html('');
			$.each(datas.ranking, function(index, ranking){
				var tr = "<tr>"+
							"<th>"+(index+1)+"º Lugar</th>"+
							"<td>"+ranking.listener.name+"</td>"+
							"<td>"+ranking.pointing+"</td>"+
							"<tr>";
				$("#ranking-list").append(tr);
			});
	},

	back: function () {
		$("a[href=#back]").click(function (){
			$.mobile.changePage('#page-quiz');
		});
	}
}