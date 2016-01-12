var mongoose        = require('mongoose');
var restifyMongoose = require('restify-mongoose');

var CiudadanoSchema = new mongoose.Schema({
    nombre : { type : String, required : true },
    apellido : { type : String, required : true },
    correo: { type : String, required : true },
    secreto: { type : String, required : true },
    rut: { type : String, required : true },
    foto: { type : String },
    fueVerificado: { type : Boolean, default: false},
    codigoVerificacion: { type : String },
});

var Ciudadano = mongoose.model('ciudadanos', CiudadanoSchema);

module.exports.api = restifyMongoose(Ciudadano);
module.exports.model = Ciudadano;
module.exports.schema = CiudadanoSchema;