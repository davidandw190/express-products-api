import { Request, Response } from "express";
import { error } from "console";
import { log } from "../utils/logger.utils";
import { createUser } from "../service/user.service";
import { CreateUserData } from "../schema/user.schema";

export async function createUserHandler(req: Request<{}, {}, CreateUserData["body"]>, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(user);
    } catch (exeption: unknown) {
        log.error(error);
        return res.status(409).send(exeption);
    }
}