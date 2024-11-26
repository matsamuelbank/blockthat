const url = require('../models/Url');

exports.addUrl = async (req, res) => {
    try {
        if (req.body.url) {
            const urlReq = req.body.url;
            
            // Vérifie si l'URL existe déjà dans la base de données
            const existingUrl = await url.findOne({ url: urlReq });
            if (existingUrl) {
                return res.status(409).json({ message: "L'URL entrée : " + urlReq + " est déjà présente." });
            }

            // Si l'URL n'existe pas, on l'ajoute
            const newUrl = new url({ url: urlReq });
            await newUrl.save();
            res.status(201).json({ message: "L'URL " + urlReq + " a bien été ajoutée." });
        } else {
            res.status(400).json({ message: "Aucune URL fournie dans la requête." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Erreur lors de l'ajout du site :", error);
    }
};


exports.removeUrl = async (req, res) => {
    try {
        const deletedUrl = await url.deleteOne({ _id: req.body.id });
        if (deletedUrl.deletedCount === 0) {
            return res.status(404).json({ message: "URL non trouvée" });
        }
        res.status(200).json({ message: "URL supprimée avec succès" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateIsvalidated = async (req, res) => {
    try {
        const updatedUrl = await url.updateOne(
            { _id: req.body.idUrl },
            { $set: { isValidated: req.body.valueValidated } }
        );
        res.status(201).json({ message: `La nouvelle valeur isValidated de l'URL est ${req.body.valueValidated}.`, updatedUrl });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.getValidatedUrls = async (req, res) => {
    try {
        const validatedUrls = await url.find({ isValidated: true });
        res.status(200).json(validatedUrls);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getNonValidatedUrls = async (req, res) => {
    try {
        const nonValidatedUrls = await url.find({ isValidated: false });
        res.status(200).json(nonValidatedUrls);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
