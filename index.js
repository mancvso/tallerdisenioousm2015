var restify = require('restify');
var restifyMongoose = require('restify-mongoose');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/chefo")

var server = restify.createServer({
    name: 'usm.talleranalisis.chefo',
    version: '0.1.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var CiudadanoSchema = new mongoose.Schema({
    nombre : { type : String, required : true },
    apellido : { type : String, required : true },
    correo: { type : String, required : true },
    rut: { type : String, required : true },
    foto: { type : String },
    fueVerificado: { type : Boolean, default: false},
    codigoVerificacion: { type : String }
});

var Ciudadano = mongoose.model('ciudadanos', CiudadanoSchema);

var ciudadanos = restifyMongoose(Ciudadano);

server.get('/ciudadanos', ciudadanos.query());
server.get('/ciudadanos/:id', ciudadanos.detail());
server.post('/ciudadanos', ciudadanos.insert());
server.patch('/ciudadanos/:id', ciudadanos.update());
server.del('/ciudadanos/:id', ciudadanos.remove());

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});