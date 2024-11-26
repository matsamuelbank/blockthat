import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../../store/slices/auth-slice';
import styles from './style.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ConnexionAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Utilisation correcte de useNavigate
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', 
        { identifiant: username, motDePasse: password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Réponse de connexion', response.data);
  
      dispatch(addUserInfo(response.data)); // Mise à jour de l'état d'authentification
      navigate('/accueil-admin'); // Redirection après connexion réussie
    } catch (error) {
      setError('Erreur de connexion. Veuillez vérifier vos identifiants.');
      console.error('Erreur de connexion', error);
    }
  }
  

  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <h1>Connexion Admin</h1>
          {error && <p className={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </>
  );
};
