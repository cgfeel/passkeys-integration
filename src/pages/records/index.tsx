import { FC, useEffect, useState } from "react";
import TableList, { dateFormat } from "../../components/TableList";
import Wrapper from "../../components/Wrapper";
import { fetchHandle } from "../../servers";

const objectEntries = <T extends object, K = keyof T>(obj: T) =>
    Object.entries(obj) as Array<[K, T[keyof T]]>;

const Records: FC = () => {
    const [list, setList] = useState<RecordsType>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHandle<RespondType>("/passkeys").then(({ data }) => {
            setLoading(false);
            setList(data);
        });
    }, []);

    return (
        <Wrapper>
            <h1 className="font-bold mb-4 text-4xl">Records list</h1>
            {loading ? (
                <div className="text-center text-gray-500 p-24">
                    <p>Loading...</p>
                </div>
            ) : (
                objectEntries(list).map(
                    ([
                        name,
                        {
                            user: { create_at, id, username },
                            record,
                        },
                    ]) => (
                        <div key={name} className="mb-10">
                            <div className="py-2 text-lg">
                                {username} (uid: {id} - reg:{" "}
                                {dateFormat(create_at)})
                            </div>
                            <TableList record={record} />
                        </div>
                    ),
                )
            )}
        </Wrapper>
    );
};

export default Records;

type RecordsType = Record<string, PassportList>;
type RespondType = {
    code: number;
    data: RecordsType;
};
