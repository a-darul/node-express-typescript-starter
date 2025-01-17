import path from 'path';

export default {
    AWS_S3: {
        accessKey: process.env.AWS_S3_ACCESS_KEY_ID || ``,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || ``,
        region: process.env.AWS_S3_REGION || `eu-west-1`,
        mediaUploadBucket: process.env.AWS_S3_MEDIA_UPLOAD_BUCKET,
        mediaDownloadBucket: process.env.AWS_S3_MEDIA_DOWNLOAD_BUCKET,
    },
    DB_CONNECTION: {
        client: `pg`,
        connection: {
            host: process.env.POSTGRE_HOST,
            user: process.env.POSTGRE_USER,
            password: process.env.POSTGRE_PASSWORD,
            database: process.env.POSTGRE_DB,
            port: process.env.POSTGRE_PORT ? parseInt(process.env.POSTGRE_PORT, 10) : 5432,
        },
        migrations: {
            directory: path.resolve(__dirname, `../data-access/migrations`),
        },
        debug: process.env.POSTGRE_DEBUG === `true`,
    },
    FIREBASE: {
        adminSdkConf: {
            type: `service_account`,
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, `\n`),
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
            authUri: `https://accounts.google.com/o/oauth2/auth`,
            tokenUri: `https://oauth2.googleapis.com/token`,
            authProviderX509CertUrl: `https://www.googleapis.com/oauth2/v1/certs`,
            clientX509CertUrl: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
        },
    },
    PLATFORM: {
        android: {
            value: `android`,
        },
        ios: {
            value: `ios`,
        },
        web: {
            value: `web`,
        },
        webAdmin: {
            value: `webAdmin`,
        },
    },
    ROLES: {
        admin: {
            roleId: 1,
            roleName: `admin`,
        },
        user: {
            roleId: 2,
            roleName: `user`,
        },
    },
    SNOWFLAKE: {
        machineId: 33,
    },
    TWILIO: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        supportPhoneNumber: process.env.TWILIO_SUPPORT_PHONE_NUMBER,
    },
};
