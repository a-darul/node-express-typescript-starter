/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
		CREATE TABLE users (
            user_id BIGINT PRIMARY KEY DEFAULT generate_snowflake_id(),
            email CHARACTER VARYING(255) NOT NULL,
            name CHARACTER VARYING(255),
            birth_date DATE,
            gender CHARACTER VARYING(10),
            image CHARACTER VARYING(150),
            version CHARACTER VARYING(150),
            platform CHARACTER VARYING(10),
            firebase_uid CHARACTER VARYING(255),
            is_onboarded BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
            updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
            CONSTRAINT users_email_unique UNIQUE (email)
        );

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`DROP TABLE users;`);
};
