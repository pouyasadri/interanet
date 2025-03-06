const express = require('express');
const {
    getUsers,
    getUser,
    getRandomUser,
    createUser,
    updateUser,
    deleteUser,
    filterUsers
} = require('../controllers/users');

const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/random').get(getRandomUser);
router.route('/filter').get(filterUsers);

router.route('/')
    .get(getUsers)
    .post(admin, createUser);

router.route('/:id')
    .get(getUser)
    .put(admin, updateUser)
    .delete(admin, deleteUser);

module.exports = router;
