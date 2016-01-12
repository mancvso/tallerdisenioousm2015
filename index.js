var restify         = require('restify');
var mongoose        = require('mongoose');
var logger          = require('restify-logger');
var ciudadanos      = require('./ciudadanos');
var llamado         = require('./llamado');

mongoose.connect("mongodb://localhost:27017/chefo")

var server = restify.createServer({
    name: 'usm.talleranalisis.chefo',
    version: '0.1.0'
});
 
// morgan syntax 
logger.format('my-simple-format', ':method :url :status');
server.use(logger('my-simple-format'));

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.patch('/ciudadanos/sesion', function(req, res){
    var user = req.body.user
    var pass = req.body.pass
    ciudadanos.model.findOne({ correo: user, secreto: pass }, function(err, doc){
        if(err){
            console.log(err)
            res.send(500)
        } else if(doc != null){
            res.send(200, doc)
        } else {
            res.send(403)
        }
    })
})

server.get('/ciudadanos/:ciudadano/nominaciones', function(req, res){
    var ciudadano = req.params.ciudadano
    llamado.model.find( { nominados : { $elemMatch: { ciudadano: new mongoose.Types.ObjectId(ciudadano)  } } }, function(err, docs){
        if(err){
            console.log(err)
            res.send(500)
        } else {
            res.send(200, docs)
        }
    })
})

ciudadanos.api.serve('/api/ciudadanos', server);

server.patch('/llamados/:llamado/votar', function(req, res){
    var llamado_id = req.params.llamado
    var nominado = req.body.nominado
    var ciudadano = req.body.ciudadano

    console.log(llamado_id, nominado, ciudadano)


    llamado.model.update({_id: new mongoose.Types.ObjectId(llamado_id), "nominados.ciudadano": nominado }, { $addToSet: { "nominados.$.votos" : ciudadano } }, function(err, doc){
        if(err){
            console.log(err)
            res.send(500)
        } else if(doc && doc.ok == 1){
            res.send(200, { status:"OK"})
        } else {
            res.send(304, doc)
        }
    })
})



server.patch('/llamados/:llamado/apoyar', function(req, res){
    var llamado_id = req.params.llamado
    var ciudadano = req.body.ciudadano

    console.log(llamado_id, ciudadano)


    llamado.model.update({_id: new mongoose.Types.ObjectId(llamado_id)}, { $addToSet: { apoyo : ciudadano }, $pull: { rechazo : ciudadano } }, function(err, doc){
        if(err){
            console.log(err)
            res.send(500)
        } else if(doc && doc.ok == 1){
            res.send(200, { status:"OK"})
        }
    })
})

server.patch('/llamados/:llamado/rechazar', function(req, res){
    var llamado_id = req.params.llamado
    var ciudadano = req.body.ciudadano

    console.log(llamado_id, ciudadano)


    llamado.model.update({_id: new mongoose.Types.ObjectId(llamado_id)}, { $addToSet: { rechazo : ciudadano } , $pull : { apoyo : ciudadano } }, function(err, doc){
        if(err){
            console.log(err)
            res.send(500)
        } else if(doc && doc.ok == 1){
            res.send(200, { status:"OK"})
        }
    })
})

server.patch('/llamados/:llamado/nominar', function(req, res){
    var llamado_id = req.params.llamado
    var ciudadano = req.body.ciudadano
    var nombre = req.body.nombre
    var argumento = req.body.argumento
    var nominante = req.body.nominante

    console.log(llamado_id, ciudadano, nombre, argumento)

    llamado.model.findOne({ _id: new mongoose.Types.ObjectId(llamado_id), "nominados.ciudadano": ciudadano }, function(err, doc){
        console.log(doc)
        if(err){
            console.log(err)
            res.send(500)
        } else if(doc != null){
            console.log("dupe")
            res.send(304)
        } else {
            llamado.model.update({_id: new mongoose.Types.ObjectId(llamado_id)}, { $addToSet: { nominados : { argumento: argumento, nombre: nombre, ciudadano: ciudadano } } }, function(err, doc){
                if(err){
                    console.log(err)
                    res.send(500)
                } else if(doc && doc.ok == 1){
                    res.send(200, { status:"OK"})
                }
            })
        }

    })


})

llamado.api.serve('/api/llamados', server);

// static server
server.get('/.*', restify.serveStatic({
  directory : './' + (process.env.PUBLIC || 'public'),
  default   : 'index.html'
}))

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});