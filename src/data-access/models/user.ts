export class User {
    userId: number;
    email: string;
    name: string;
    birthDate?: Date;
    gender?: string;
    image?: string;
    version?: string;
    platform?: string;
    firebaseUid: string;
    isOnboarded: boolean;
    createdAt: Date;
}
