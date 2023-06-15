const mongoose = require('mongoose');

async function main() {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(
            "mongodb://127.0.0.1:27017/depoimentosDB?retryWrites=true&w=majority"
        );
        
        console.log("Conectado ao MongoDB!");
    }

    catch (error) {
        console.log(error);
    }
}

module.exports = main;

// mongodb+srv://gregassagraf:l1DuF09jGiCg26jM@cluster0.bwaedeh.mongodb.net/?retryWrites=true&w=majority