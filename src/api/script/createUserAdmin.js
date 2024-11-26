const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/block_that', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const sel = 10;
const mdpEnClair = 'admin'; // ici il faut entrer le mdp en clair

bcrypt.hash(mdpEnClair, sel, async (err, hash) => {
  if (err) {
    console.error('Erreur lors du hachage du mot de passe:', err);
    return;
  }

  try {
    //crétion d'un schema user 
    const user = new User({
      nom: 'nom', 
      prenom: 'prenom',
      langue: 'francais',
      identifiant: 'admin',
      motDePasse: hash
    });

    await user.save();
    console.log('Utilisateur sauvegardé avec succès');
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
  }
});
