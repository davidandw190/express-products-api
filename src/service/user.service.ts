import  DocumentDefinition from 'mongoose';
import { omit } from "lodash";
import { UserModel, UserDocument, UserData } from '../model/user.model';

export async function createUser(data: UserData) {
    try {
        const createdUser = await UserModel.create(data);

        return omit(createUser.toJSON(), "password");
    
    } catch (exception: any) {
        throw new Error(exception);
    }
}