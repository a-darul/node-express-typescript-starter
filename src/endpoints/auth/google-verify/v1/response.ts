export const responseSchema = {
    type: `object`,
    properties: {
        userId: {
            type: `integer`,
        },
        email: {
            type: `string`,
        },
        name: {
            type: `string`,
        },
        birthDate: {
            type: [`string`, `null`],
        },
        gender: {
            type: [`string`, `null`],
        },
        image: {
            type: [`string`, `null`],
        },
        version: {
            type: `string`,
        },
        platform: {
            type: `string`,
        },
        firebaseUid: {
            type: `string`,
        },
        isOnboarded: {
            type: `boolean`,
        },
        createdAt: {
            type: `string`,
        },
    },
    required: [`userId`, `email`, `name`, `isOnboarded`, `createdAt`],
};
