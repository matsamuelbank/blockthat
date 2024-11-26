import { useState } from "react";
import styles from "./style.module.css";
import axios from "axios";
import { clearUserInfo } from '../../store/slices/auth-slice';
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useEffect } from "react";


export function Accueil() {
    const [valueUrl, setValueUrl] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Liste des chemins pour lesquels on souhaite effacer les informations utilisateur
        const publicPaths = ['/'];
        if (publicPaths.includes(location.pathname)) {
            dispatch(clearUserInfo());
        }
    }, [location, dispatch]);

    function handleChange(event) {
        setValueUrl(event.target.value);
    }

    
    async function sendUrl() {
        try {
            const response = await axios.post('http://localhost:3001/api/url/addUrl', { url: valueUrl });
            console.log('URL ajoutée avec succès:', response.data);
            setModalMessage("URL ajoutée avec succès : " + valueUrl);
            setValueUrl("");
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'URL:", error);
            setModalMessage("Erreur : " + (error.response?.data.message || "Impossible d'ajouter l'URL"));
        }
        setModalVisible(true); // Affiche la modale après l'ajout ou en cas d'erreur
    }

    function closeModal() {
        setModalVisible(false);
    }

    return (
        <>
            <div>
                <p className={styles.p1}>Avez-vous un site suspect à ajouter ?</p>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.textUrl}
                        type="text"
                        placeholder="Veuillez entrer l'URL du site"
                        value={valueUrl}
                        onChange={handleChange}
                    />
                    <button onClick={sendUrl} className={styles.submitButton}>✔</button>
                </div>
            </div>
            
            {modalVisible && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{modalMessage}</p>
                        <button onClick={closeModal} className={styles.closeButton}>Fermer</button>
                    </div>
                </div>
            )}
        </>
    );
}
