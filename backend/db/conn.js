const mongoose = require('mongoose');

async function main() {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(
            "mongodb+srv://gregassagraf:l1DuF09jGiCg26jM@cluster0.bwaedeh.mongodb.net/?retryWrites=true&w=majority"
        );
        
        console.log("Conectado ao MongoDB Atlas");
    }

    catch (error) {
        console.log(error);
    }
}

module.exports = main;