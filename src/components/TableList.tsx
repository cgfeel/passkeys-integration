import { FC } from "react";

const dateFormat = (val: number) =>
    new Date(val).toLocaleString().replace(/\//g, "-");

const TableList: FC<Pick<PassportList, "record">> = ({ record }) => (
    <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Counter
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CreateAt
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LastUsed
                </th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {record.map(({ counter, create_at, id, last_used }) => (
                <tr key={id}>
                    <td className="px-6 py-4 break-all">{id}</td>
                    <td className="px-6 py-4">{counter}</td>
                    <td className="px-6 py-4 break-all">
                        {dateFormat(create_at)}
                    </td>
                    <td className="px-6 py-4 break-all">
                        {dateFormat(last_used)}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export { dateFormat };

export default TableList;
