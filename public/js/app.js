var env = nunjucks.configure('snippets', { autoescape: true });


env.addFilter('percentage', function(first, second) {
	var total = first + second;
    return (first/total)*100 + "%"
});

var client = restifier.createJsonClient('localhost:3000/api/');

var restClient = ê.createRestClient({
    host: "localhost:3000", // required
});

function goto(url, data){
	var content = $("#content");
	$("#content").html( nunjucks.render(url, data) );
	Holder.run();
}

function handle_fail(entity, error){
	if(error.status == 500){
		swal("Se ha producido un error", "Un error interno ha producido un fallo\nDebug:\n"+error.responseText, "error")
	} else if(error.status == 404){
		swal( entity + " no encontrado", "Es posible que el dato que solicita haya sido eliminado", "warning")
	} else if(error.status == 403){
		swal( entity + " no encontrado", "Verifica tu usuario y contraseña y aseg´urate de haber iniciado sesi´on", "warning")

	} else {
		swal("Se ha producido un error", "Error desconocido en: " + entity, "error")
	}
	console.log("Error", error)
}

//Ciudadanos
function ciudadanos(id){
	if(id){
		restClient.read('/api/ciudadanos/' + id)
		.done( function(ciudadano){
			restClient.read('/ciudadanos/' + id + '/nominaciones').done( function(nominaciones){
				goto('ciudadano.htm', { ciudadano: ciudadano, nominaciones: nominaciones })
			}).fail( function(e){
				handle_fail("Nominaciones del ciudadano", e)
			})
		})
		.fail( function(err){
			handle_fail("Ciudadano", err)
		})
	} else {
		restClient.read('/api/ciudadanos')
		.done( function(data){
			goto('ciudadanos.htm', data)
		})
		.fail( function(err){
			handle_fail("Ciudadano", err)
		})
	}
}

//Llamados
function llamados(id){
	if(id){
		restClient.read('/api/llamados/' + id)
		.done( function(data){
			goto('llamado.htm', {llamado: data })
		})
		.fail( function(err){
			handle_fail("Llamado", err)
		})
	} else {
		restClient.read('/api/llamados')
		.done( function(data){
			goto('index.htm', { llamados: data })
		})
		.fail( function(err){
			handle_fail("Llamado", err)
		})
	}
}

function votar(llamado_id, nominado){
	if(window.sesion != null){

		restClient.partialUpdate("/llamados/" + llamado_id + "/votar", {
		    nominado: nominado,
		    ciudadano: window.me
		})
	    .done(function(response) {
	    	console.log(response)
	        llamados(llamado_id)
	    })
	    .fail(function() {
	        swal("Voto registrado", "Ya has votado por este candidato", "info")
	    });
	} else {
		goto('login.htm')
	}

}

function apoyar(llamado_id, ciudadano) {
	if(window.sesion != null){
		restClient.partialUpdate("/llamados/" + llamado_id + "/apoyar", {
		    ciudadano: window.me
		})
	    .done(function(response) {
	    	console.log(response)
	        llamados(llamado_id)
	    })
	    .fail(function(e) {
	        swal("Voto registrado", "Ya has apoyado este llamado", "info")
	        console.log(e)
	    });
    } else {
		goto('login.htm')
	}
}

function rechazar(llamado_id, ciudadano) {
	if(window.sesion != null){
		restClient.partialUpdate("/llamados/" + llamado_id + "/rechazar", {
		    ciudadano: window.me
		})
	    .done(function(response) {
	    	console.log(response)
	        llamados(llamado_id)
	    })
	    .fail(function(e) {
	        swal("Voto registrado", "Ya has rechazado este llamado", "info")
	        console.log(e)
	    });
	} else {
		goto('login.htm')
	}
}

function candidatos(llamado_id, llamado_nombre){
	console.log(llamado_id)
	restClient.read('/api/ciudadanos')
		.done( function(data){
			goto('nominar.htm', { ciudadanos: data, llamado: { nombre: llamado_nombre, _id: llamado_id} } )
		})
		.fail( function(err){
			handle_fail("Llamado", err)
		})	
}

function nominar (llamado_id, candidato_id, nombre) {
	console.log(llamado_id, candidato_id, nombre)

	if(window.sesion != null){
		restClient.partialUpdate("/llamados/" + llamado_id + "/nominar", {
		    ciudadano: candidato_id,
		    argumento: "Nominado",
		    nombre: nombre,
		    nominante: window.me
		})
	    .done(function(response) {
	    	console.log(response)
	        llamados(llamado_id)
	    })
	    .fail(function(e) {
	        swal("Nominado", "Ya has nominado a este candidato", "info")
	        console.log(e)
	    });
    } else {
		goto('login.htm')
	}
}

function login(){
	var user = $('#login-id').val()
	var pass = $('#login-secret').val()
	restClient.partialUpdate('/ciudadanos/sesion', { user: user, pass: pass }).done(function(sesion){
		window.sesion = sesion
		window.me = sesion._id
		llamados()
	}).fail(function(e){
		handle_fail("Usuario", e)

	})
}

function yo(){
	if(window.sesion != null){
		ciudadanos(window.me)
	} else {
		goto('login.htm')
	}
}

function salir(){
	window.sesion = null
	window.me = null
	delete window.sesion
	delete window.me
	llamados()
}

//Index
$(document).ready(function(){
	llamados();
});