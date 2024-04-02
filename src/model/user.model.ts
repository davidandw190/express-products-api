import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';

export interface UserData {
    email: string,
    name: string,
    password: string,
    address: string,
}


export interface UserDocument extends mongoose.Document {
    email: string,
    name: string,
    password: string,
    address: string,
    createdAt: Date,
    updatedAt: Date,

    comparePassword(candidatePassword: string): Promise<boolean>,
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

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean>  {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

export const UserModel = mongoose.model<UserDocument>('User', userSchema);

