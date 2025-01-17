import fs from 'fs';

const load = (file: string) => {
    const sqlQuery = fs
        .readFileSync(`${__dirname}/${file}`)
        .toString()
        .replace(/(\r\n|\n|\r)/gm, ` `)
        .replace(/\s+/g, ` `);
    return sqlQuery;
};

export default {
    users: {
        insertUser: load(`users/insert-user.sql`),
    },
};
