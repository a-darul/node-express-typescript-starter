import { execQuerySingle, getKnex } from '..';
import { User } from '../models/user';
import sql from './queries';

const findUserByEmail = async (email: string): Promise<User | null> => {
    let user: User | null = null;
    const db = getKnex();
    const result = await db
        .select([
            'userId',
            'email',
            'name',
            'birthDate',
            'gender',
            'image',
            'version',
            'platform',
            'firebaseUid',
            'isOnboarded',
            db.raw('created_at::varchar AS "createdAt"'),
        ])
        .from<User>('users')
        .where('email', email)
        .first();

    if (result) {
        user = result;
    }

    return user;
};

const insertUser = async (user: User): Promise<User> => {
    const result = await execQuerySingle(sql.users.insertUser, { ...user });

    return result as User;
};

export default { findUserByEmail, insertUser };
