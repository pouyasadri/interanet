import { createContext, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [randomUser, setRandomUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/users');
            setUsers(res.data.data);
            setFilteredUsers(res.data.data);
            setLoading(false);
            return res.data.data;
        } catch (err) {
            setLoading(false);
            return [];
        }
    };

    const getRandomUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/users/random');
            setRandomUser(res.data.data);
            setLoading(false);
            return res.data.data;
        } catch (err) {
            setLoading(false);
            return null;
        }
    };

    const filterUsers = async (filters) => {
        setLoading(true);
        const { name, location, category } = filters;

        try {
            let queryString = 'http://localhost:8000/api/users/filter?';

            if (name) queryString += `name=${name}&`;
            if (location) queryString += `location=${location}&`;
            if (category) queryString += `category=${category}`;

            const res = await axios.get(queryString);
            setFilteredUsers(res.data.data);
            setLoading(false);
            return res.data.data;
        } catch (err) {
            setLoading(false);
            return [];
        }
    };

    const createUser = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.post(
                'http://localhost:8000/api/users',
                userData,
                config
            );
            return res.data.data;
        } catch (err) {
            return null;
        }
    };

    const updateUser = async (id, userData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.put(
                `http://localhost:8000/api/users/${id}`,
                userData,
                config
            );
            return res.data.data;
        } catch (err) {
            return null;
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${id}`);
            return true;
        } catch (err) {
            return false;
        }
    };

    return (
        <UserContext.Provider
            value={{
                users,
                filteredUsers,
                randomUser,
                loading,
                getUsers,
                getRandomUser,
                filterUsers,
                createUser,
                updateUser,
                deleteUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
