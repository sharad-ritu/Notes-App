const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    googleId: {
        type: 'string',
        required: true
    },
    displayName: {
        type: 'string',
        required: true
    },
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    profileImage: {
        type: 'string',
        required: true
    },
    createdAt: {
        type: 'date',
        default: Date.now()
    }
});

module.exports = mongoose.model('User', UserSchema);