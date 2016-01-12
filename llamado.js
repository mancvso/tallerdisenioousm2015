var mongoose        = require('mongoose');
var restifyMongoose = require('restify-mongoose');

var Schema = new mongoose.Schema({
    nombre : { type : String, required : true },
    descripcion: { type : String, required : true },
    foto: { type : String },
    agenda: [{
    	fecha: { type: Date, default: Date.now },
    	detalle: { type: String },
    	tipo: { type: String }
    }],
    nominados: [{
    	_id: false,
    	ciudadano: { type: mongoose.Schema.Types.ObjectId, ref: 'ciudadanos' },
    	estado: { type: String, enum: ['aceptado', 'rechazado', 'sin confirmar'], default: 'sin confirmar'},
    	nombre: { type:String },
    	argumento: { type: String },
    	votos: [{ type: String }]
    }],
    objetivos: [{
    	descripcion: { type: String },
    	prioridad: { type: String, enum: ['alta', 'media', 'baja']}
   	}],
   	apoyo: [{ type: String }],
   	rechazo: [{ type: String }]
});

var Model = mongoose.model('llamados', Schema);

module.exports.api = restifyMongoose(Model, {populate: 'nominados.ciudadano'});
module.exports.model = Model;
module.exports.schema = Schema;