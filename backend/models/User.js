import mongoose from 'mongoose';

// A user who can log in to the app.
// The password is NEVER stored as plain text — only its bcrypt hash.
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true }, // bcrypt hash
        role: { type: String, enum: ['admin', 'user'], default: 'user' }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
