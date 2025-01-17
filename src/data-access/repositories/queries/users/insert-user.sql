INSERT
INTO users (email, name, image, version, platform, firebase_uid)
VALUES (:email, :name, :image, :version, :platform, :firebaseUid)
RETURNING
	user_id AS "userId",
	email,
	name,
	birth_date AS "birthDate",
	gender,
	image,
	version,
	platform,
	firebase_uid AS "firebaseUid",
	is_onboarded AS "isOnboarded",
	created_at::varchar AS "createdAt";
