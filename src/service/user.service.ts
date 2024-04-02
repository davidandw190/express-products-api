import { UserModel, UserData } from '../model/user.model';
import { omit } from "lodash";


export async function createUser(data: UserData) {
    try {
        const createdUser =  await UserModel.create(data);

        return omit(createdUser.toJSON(), "password");
    
    } catch (exception: any) {
        throw new Error(exception);
    }
}