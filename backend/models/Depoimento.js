const mongoose = require('mongoose');

const { Schema } = mongoose;

const depoimentoSchema = new Schema({
    usuario_id: {
        type: String,
        required: true
    },

    usuario_nome: {
        type: String,
        required: true
    },

    is_USPIANO: {
        type: Boolean,
        required: true
    },

    depoimento_video: {
        type: String,
        required: true
    },
}, {timestamps: true});

const Depoimento = mongoose.model('Depoimento', depoimentoSchema);

module.exports = {
    Depoimento,
    depoimentoSchema,
};