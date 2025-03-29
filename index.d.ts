type PassKeyBaseType = {
    counter: number;
    create_at: number;
    id: string;
    last_used: number;
    user: UserModelType;
};

type PassportList = {
    record: Pick<PassKeyBaseType, 'counter' | 'create_at' | 'id' | 'last_used'>[];
    user: UserModelType;
}

type UserModelType = {
    create_at: number;
    id: number;
    username: string;
}