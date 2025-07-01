import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';

import './Main.css';

import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import itsamatch from '../assets/itsamatch.png'

export default function Main({ match }) {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);
    const userId = match.params._id || localStorage.getItem('user');

    useEffect(() => {
        if (!userId) {
            history.push('/');
            return;
        }
        async function loadUsers(){
            try {
                const response = await api.get('/devs', {
                    headers: {
                        user: userId,
                    }
                });
                setUsers(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    localStorage.removeItem('user');
                    history.push('/');
                }
            }
        }
        loadUsers();
    }, [userId, history]);
    useEffect(() => {
        if (!userId) return;
        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3050', {
            query: { user: userId }
        });
        socket.on('match', dev => {
            setMatchDev(dev);
        });
        return () => socket.disconnect();
    }, [userId]);
    async function handleDislike(_id){
        await api.post(`/devs/${_id}/dislikes`, null, {
            headers: {
                user: userId,
            }
        });
        setUsers(users.filter(user => user._id !== _id));
    };
    async function handleLike(_id){
        await api.post(`/devs/${_id}/likes`, null, {
            headers: {
                user: userId,
            }
        });
        setUsers(users.filter(user => user._id !== _id));
    };
    return(
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="TinDev" />
            </Link>
            { users.length > 0 
            ? <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <img src={user.avatar} alt="" />
                        <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                        </footer>
                        <div className="buttons">
                            <button type="button" onClick={() => handleDislike(user._id)}>
                                <img src={dislike} alt=""/>
                            </button>
                            <button type="button" onClick={() => handleLike(user._id)}>
                                <img src={like} alt=""/>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            : <div className="empty">Acabou :(</div>
            }
            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt=""/>
                    <img className="avatar" src={matchDev.avatar} alt=""/>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
                    <button type="button" onClick={() => setMatchDev(null)}>Fechar</button>
                </div>
            ) }
        </div>
    )
}