import styles from './style.module.css';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useSelector } from 'react-redux';

export function ListUrl() {
    const [validatedUrls, setValidatedUrls] = useState([]);
    const [nonValidatedUrls, setNonValidatedUrls] = useState([]);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const valueAuth = userInfo.isAuthenticated;
    const token = "ici mettre le token api généré dans l'interface pi-hole";

    async function getValidatedUrls() {
        try {
            const response = await axios.get('http://localhost:3001/api/url/validatedUrls');
            setValidatedUrls(response.data);
            // console.log("Liste d'urls validées", response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des URLs validées:", error);
        }
    }

    async function getNonValidatedUrls() {
        try {
            const response = await axios.get('http://localhost:3001/api/url/nonValidatedUrls');
            setNonValidatedUrls(response.data);
            // console.log("Liste d'urls non validées", response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des URLs non validées:", error);
        }
    }

    async function updateIsValidated(urlId, valueIsValidated) {
        try {
            const response = await axios.post(
                'http://localhost:3001/api/url/updateIsvalidated',
                {
                    idUrl: urlId,
                    valueValidated: valueIsValidated
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`, // Rajout du token pour authentifier le user dans le middleware auth
                    },
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'URL:", error);
        }
    }
    

    useEffect(() => {
        getValidatedUrls();
        getNonValidatedUrls();
    }, []);

    function dragStart(e, url, sourceListName, idUrl, valueIsValidated) {
        if (!valueAuth) return;
        e.dataTransfer.setData("text/plain", JSON.stringify({ url, sourceListName, idUrl, valueIsValidated }));
    }

    function dragOver(e) {
        if (!valueAuth) return;
        e.preventDefault(); // Permet au drop de s'exécuter
    }

    function drop(e, targetListName) {
        if (!valueAuth) return;
        e.preventDefault();
        
        // Récupère les données de l'élément déplacé depuis le dataTransfer
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { url, sourceListName, idUrl, valueIsValidated } = data;
    
        console.log("URL récupérée:", url);
    
        // Ignore si on fait un drop dans la même liste
        if (targetListName === sourceListName) return;
    
        // Détermine les setters et listes source et cible en fonction des noms des listes
        let sourceList, sourceListSetter, targetList, targetListSetter;
        if (sourceListName === 'validatedUrls') {
            sourceList = validatedUrls;
            sourceListSetter = setValidatedUrls;
        } else {
            sourceList = nonValidatedUrls;
            sourceListSetter = setNonValidatedUrls;
        }
    
        if (targetListName === 'validatedUrls') {
            targetList = validatedUrls;
            targetListSetter = setValidatedUrls;
            // Requête d'update pour modifier la valeur de isValidated à true
            updateIsValidated(idUrl, !valueIsValidated);
            //suppression de l'url de la white liste
            removeFromWhitelist(url.url)
            //ajout de l'url a la black liste de pi-hole
            addToBlacklist(url.url)
        } else {
            targetList = nonValidatedUrls;
            targetListSetter = setNonValidatedUrls;
            // Requête d'update pour modifier la valeur de isValidated à false
            updateIsValidated(idUrl, !valueIsValidated);
            // suppression de l'url de la liste blanche 
            removeFromBlacklist(url.url)
            //ajout de l'url a la white liste blanche de pi-hole
            addToWhitelist(url.url)
        }
    
        // Met à jour les listes
        sourceListSetter(sourceList.filter((item) => item.url !== url.url)); // Supprime de la liste source
        targetListSetter([...targetList, url]); // Ajoute à la liste cible
    }
    

    //fonctions pour interagir avec l'api de pi-hole

    const extractDomain = (url) => {
        if (typeof url !== "string" || url.trim() === "") {
            console.error("L'URL fournie n'est pas une chaîne de caractères valide ou est vide.");
            return null; // Retourne null si l'URL n'est pas valide
        }
    
        try {
            // Si l'URL ne contient pas de schéma, ajoute "https://"
            const validUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
            const domain = new URL(validUrl).hostname;  // Extrait uniquement le domaine
            return domain;
        } catch (error) {
            console.error("Erreur lors de l'extraction du domaine de l'URL :", error);
            return null;  // Retourne null si l'URL n'est pas valide
        }
    };
    
      
    //ajout d'une url en attente de validation (en attendant elle est dans la white list)
    const addToWhitelist = async (urlSite) => {

        const domaine = extractDomain(urlSite);
        if (!domaine) {
          console.error("L'URL fournie n'est pas valide.");
          return;
        }
        const apiUrl = `http://172.20.10.8/admin/api.php`;
        try {
          const response = await axios.get(`${apiUrl}?list=white&add=${domaine}&auth=${token}`);
          console.log(response.data); // Affiche la réponse de l'API
        } catch (error) {
          console.error("Erreur lors de l'ajout à la liste blanche :", error);
        }
    };

    // ajout d'une url dans la black list (ajout d'une url frauduleuses)
    const addToBlacklist = async (urlSite) => {

        const domaine = extractDomain(urlSite);
        if (!domaine) {
          console.error("L'URL fournie n'est pas valide.");
          return;
        }

        const apiUrl = `http://172.20.10.8/admin/api.php`;
      
        try {
          const response = await axios.get(`${apiUrl}?list=black&add=${domaine}&auth=${token}`);
          console.log(response.data);
        } catch (error) {
          console.error("Erreur lors de l'ajout à la liste noire :", error);
        }
    };

    // suppréssion d'une url de la white list
    const removeFromWhitelist = async (urlSite) => {

        const domaine = extractDomain(urlSite);
        if (!domaine) {
          console.error("L'URL fournie n'est pas valide.");
          return;
        }
        const apiUrl = `http://172.20.10.8/admin/api.php`;
      
        try {
          const response = await axios.get(`${apiUrl}?list=white&sub=${domaine}&auth=${token}`);
          console.log(response.data);
        } catch (error) {
          console.error("Erreur lors de la suppression de la liste blanche :", error);
        }
    };

    const removeFromBlacklist = async (urlSite) => {

        const domaine = extractDomain(urlSite);
        if (!domaine) {
          console.error("L'URL fournie n'est pas valide.");
          return;
        }
        const apiUrl = `http://172.20.10.8/admin/api.php`;
      
        try {
          const response = await axios.get(`${apiUrl}?list=black&sub=${domaine}&auth=${token}`);
          console.log(response.data);
        } catch (error) {
          console.error("Erreur lors de la suppression de la liste noire :", error);
        }
    };
    
    return (
        <div className={styles.container}>
            {/* Liste de sites validés */}
            <div
                className={styles.left}
                onDragOver={valueAuth ? dragOver : null}
                onDrop={valueAuth ? (e) => drop(e, 'validatedUrls') : null}
            >
                <Typography variant="h6" component="div" gutterBottom>
                    Sites frauduleux
                </Typography>
                
                {validatedUrls.length === 0 ? (
                    <Typography variant="body2">Aucune URL frauduleuse.</Typography>
                ) : (
                    <List component="nav">
                        {validatedUrls.map((url, index) => (
                            <Card
                                key={index}
                                className={styles.card}
                                draggable={valueAuth}
                                onDragStart={valueAuth ? (e) => dragStart(e, url, 'validatedUrls', url._id, url.isValidated) : null}
                            >
                                <CardContent sx={{ padding: '0px' }}>
                                    <ListItem sx={{ paddingBottom: '0px' }}>
                                        <CheckCircleIcon color="success" />
                                        <ListItemText primary={url.url} />
                                    </ListItem>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                )}
            </div>
    
            {/* Liste de sites en attente de validation */}
            <div
                className={styles.right}
                onDragOver={valueAuth ? dragOver : null}
                onDrop={valueAuth ? (e) => drop(e, 'nonValidatedUrls') : null}
            >
                <Typography variant="h6" component="div" gutterBottom>
                    Sites en attente de vérification
                </Typography>
                
                {nonValidatedUrls.length === 0 ? (
                    <Typography variant="body2">Aucune URL en attente de vérification.</Typography>
                ) : (
                    <List component="nav">
                        {nonValidatedUrls.map((url, index) => (
                            <Card
                                key={index}
                                className={styles.card}
                                draggable={valueAuth}
                                onDragStart={valueAuth ? (e) => dragStart(e, url, 'nonValidatedUrls', url._id, url.isValidated) : null}
                            >
                                <CardContent sx={{ padding: '0px' }}>
                                    <ListItem sx={{ paddingBottom: '0px' }}>
                                        <HourglassEmptyIcon color="warning" />
                                        <ListItemText primary={url.url} />
                                    </ListItem>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                )}
            </div>
        </div>
    );
    
}