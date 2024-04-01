import mogoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    email: string,
    name: string,
    password: string,
    address: string,
    createdAt: Date,
    updatedAt: Date,
}

export const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        address: { type: String, required: false },
    }, 
    {
        timestamps: true, 
    }

);

userSchema.pre("save",  async function (next) {
    let user = this as UserDocument;

    if (!user.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(config.get<number>('SALT_ROUND_FACTOR'));
    const hash = await bcrypt.hashSync(user.password, salt);
    
    user.password = hash;
    
    return next();
})

export const User = mongoose.model("User", userSchema);

