/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
		CREATE SEQUENCE IF NOT EXISTS public.global_id_sequence;

		CREATE OR REPLACE FUNCTION generate_snowflake_id(OUT result BIGINT) AS $$
		DECLARE
				epoch BIGINT := 1735689600000;
				seq_id BIGINT;
				now_millis BIGINT;
				shard_id INT := 33;
		BEGIN
				SELECT nextval('public.global_id_sequence') % 1024 INTO seq_id;

				SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
				result := (now_millis - epoch) << 23;
				result := result | (shard_id << 10);
				result := result | (seq_id);
		END;
		$$ LANGUAGE PLPGSQL;
	`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`DROP FUNCTION generate_snowflake_id();`);
};
