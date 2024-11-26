# Application de Gestion des Sites Suspects

## Description

Cette application React permet aux utilisateurs d'ajouter des URL suspectes à une base de données MongoDB. Les URL sont ajoutées avec un statut de validation par défaut défini sur `false`. L'application intègre également une API Pi-hole afin d'echanger avec un serveur Pi-hole pour gérer les listes blanches et noires au niveau du réseau.

### Fonctionnalités

1. **Ajout d'URL suspectes :**
   - Les utilisateurs peuvent soumettre des URL qu'ils soupçonnent d'être frauduleuses.
   - Ces URL sont enregistrées dans MongoDB avec un statut de validation initialement défini sur `false`.
   - Les URL ajoutées sont d'abord placées dans la whitelist de Pi-hole, ce qui permet aux utilisateurs de les consulter avant validation de   l'admnistrateur.

2. **Validation des URL :**
   - Une fois qu'une URL est validée par un administrateur, son statut dans la base de données passe à `true`.
   - Elle est alors déplacée de la whitelist à la blacklist de Pi-hole, la rendant inaccessible sur le réseau.

### Installation 

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/ton-nom-d-utilisateur/ton-repo.git
   cd ton-repo

2. **Installation de MongoDb et MongoDb compass**
    - aller sur le site officielle de MongoDb et télécharger  MongoDb et MongoDb Comapass(pour avoir une interface graphique des bases de données), tout cela en tenant compte de votre système d'exploitation


3. **Installation d'une debianX( Exemple debian12 ,prendre la version la plus recente)**
    - Aller sur le site de debian.org , télécharger une debian iso , l'ajoute dans un hyperviseur comme virtualbox , paramétrer la machine , lancer l'installation et Suivre les étapes d'installation
    - Après installation de la debian, il faut mettre l'adresse ip de la machine debian en static dans le fichier /etc/network/interfaces
    - installer  pi-hole en entrant cette ligne : `curl -sSL https://install.pi-hole.net | bash` et suivez les étapes
    - pi-hole utilise par défaut uns server web lighttpd, si vous avez deja un server web tel que apache2, veuillez le stoper ou le configurer afin qu'il utilise pi-hole
    - Définir le server pi-hole comme server dns principale du réseau local directement sur le routeur du réseau local ou manuellement sur chaque appareil en ajoutant l'adresse ip du routeur

4. Lancer l'application :
    - Pour la partie front-end :
        - à la racine du dossier `blockthat` entrez la suivante pour installer toutes les dépendances nécessaires : `npm install`
        - après cela , lancer l'application en entrant `npm start`
    - Pour la partie backend : 
        - de la racine (blockthat), aller dans le dossier api en entrant `cd src/api ` , une fois dans le dossier api installer les dépendnaces en entrant `npm install`
        - une fois les dépendances installées, lancer l'api en entrant `npm run dev` 
