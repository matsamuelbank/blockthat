import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from '../../store/slices/auth-slice';
import styles from './style.module.css'
import { ListUrl } from '../ListUrl/ListUrl';

export function AccueilAdmin(){
    const dispatch = useDispatch();

    function logout(){
        dispatch(clearUserInfo())
    }

    const userInfo = useSelector((state) => state.auth.userInfo)

    return(
        <>
            <div className={styles.container}>
                <div className={styles.left}>
                    <p>Nom de l'administrateur:</p>
                    <p>{userInfo.userFirstName+" "+userInfo.userName}</p>
                    <button onClick={logout}>deconnexion</button>
                </div>
                <div className={styles.right}>
                    <h1>Gestions des urls frauduleuses</h1>
                    <ListUrl />
                </div>
            </div>
        </>
    )
}