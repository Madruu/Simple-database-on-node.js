import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//Creating a schema for the user, with the roles that he might have, being the user one the only one that is required, because not everybody is an admin or editor

const userSchema = new Schema(
{
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number,
        Editor: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
})

export default mongoose.model('User', userSchema);