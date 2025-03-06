const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const importData = async () => {
    try {
        const User = require('./models/User');

        let count = 0;
        try {
            count = await User.countDocuments().maxTimeMS(5000).exec();
            console.log(`Found ${count} users in database`);
        } catch (countError) {
            console.error('Error counting documents:', countError.message);
            return;
        }

        if (count === 0) {
            console.log('No users found, importing sample data...');

            const dataFilePath = path.join(__dirname, 'data', 'users.json');
            if (!fs.existsSync(dataFilePath)) {
                console.error(`Data file not found at: ${dataFilePath}`);

                const dataDir = path.join(__dirname, 'data');
                if (!fs.existsSync(dataDir)) {
                    fs.mkdirSync(dataDir);
                    console.log(`Created _data directory at: ${dataDir}`);
                }

                console.log('Creating a sample admin user...');
                await User.create({
                    gender: 'male',
                    firstname: 'Admin',
                    lastname: 'User',
                    email: 'admin@admin.com',
                    password: '$2b$10$31.T.lm8RktHEeaU89shD.TwLi0VCH9t7Vw2P4dq4eZ0vQiBKZ2Zy', // 'admin'
                    phone: '07-39-81-18-27',
                    birthdate: '1988-11-04',
                    city: 'Paris',
                    country: 'France',
                    photo: 'https://randomuser.me/api/portraits/men/42.jpg',
                    category: 'Client',
                    isAdmin: true
                });
                console.log('Sample admin user created! (admin@admin.com / admin)');
                return;
            }

            try {
                const usersData = fs.readFileSync(dataFilePath, 'utf-8');

                const users = JSON.parse(usersData);

                await User.insertMany(users);
                console.log(`${users.length} users imported successfully!`);
            } catch (readError) {
                console.error('Error reading or parsing user data:', readError);
            }
        } else {
            console.log(`Found ${count} users in database, skipping import.`);
        }
    } catch (err) {
        console.error('Error during data import:', err.message);
    }
};

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    await importData();

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        server.close(() => process.exit(1));
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
});
