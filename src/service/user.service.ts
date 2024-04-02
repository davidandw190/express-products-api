import { omit } from "lodash";
import { UserModel, UserDocument, UserData } from '../model/user.model';
import { TypeOf } from 'zod';

export async function createUser(data: UserData) {
    try {
        return await UserModel.create(data);

        // return omit(createUser.toJSON(), "password");
    
    } catch (exception: any) {
        throw new Error(exception);
    }
}