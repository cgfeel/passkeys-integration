type PassKeyBaseType = {
    counter: number;
    create_at: number;
    last_used: number;
    user: UserModelType;
};

type PassportList = {
    info: UserModelType;
    record: Pick<PassKeyBaseType, 'counter' | 'create_at' | 'last_used'>;
}

type UserModelType = {
    create_at: number;
    id: number;
    username: string;
}