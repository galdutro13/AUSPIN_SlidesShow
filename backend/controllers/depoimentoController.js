const {Depoimento: DepoimentoModel} = require('../models/Depoimento');

const depoimentoController = {
    create: async (req, res) => {
        try {
            const depoimento = {
                usuario_id: req.body.usuario_id,
                usuario_nome: req.body.usuario_nome,
                is_USPIANO: req.body.is_USPIANO,
                depoimento_video: req.body.depoimento_video,
            };

            const response = await DepoimentoModel.create(depoimento);

            res.status(201).json({response, msg: "Depoimento criado com sucesso!"});
        }
        catch (error) {
            console.log(error);
        }
    },

    getAll: async (req, res) => {
        try {
            const depoimentos = await DepoimentoModel.find();

            res.json(depoimentos);
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req, res) => {
        try{
            //id => URL => /api/depoimentos/:id
            const id = req.params.id;
            const depoimento = await DepoimentoModel.findById(id);
            if(!depoimento){
                res.status(404).json({msg: "Depoimento não encontrado!"});
                return;
            }
            res.json(depoimento);
        }catch(error){
            console.log(error);
        }
    },

    delete: async (req, res) => {
        try{
            const id = req.params.id;
            const depoimento = await DepoimentoModel.findById(id);
            if(!depoimento){
                res.status(404).json({msg: "Depoimento não encontrado!"});
                return;
            }

            const deleteDepoimento = await DepoimentoModel.findByIdAndDelete(id);

            res
                .status(200)
                .json({ deleteDepoimento, msg: "Depoimento deletado com sucesso!"});

            res.json(depoimento);
        }catch(error){
            console.log(error);
        }
    },

    update: async (req, res) => {
        const id = req.params.id;

        const depoimento = {
            usuario_id: req.body.usuario_id,
            usuario_nome: req.body.usuario_nome,
            is_USPIANO: req.body.is_USPIANO,
            depoimento_video: req.body.depoimento_video,
        };

        const updateDepoimento = await DepoimentoModel.findByIdAndUpdate(id, depoimento);
        
        if(!updateDepoimento){
            res.status(404).json({msg: "Depoimento não encontrado!"});
            return;
        }

        req
            .status(200)
            .json({depoimento, msg: "Depoimento atualizado com sucesso!"});
    },
};

module.exports = depoimentoController;
