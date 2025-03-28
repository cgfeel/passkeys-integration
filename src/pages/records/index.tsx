import { FC, useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";

const Records: FC = () => {
    const [list, setList] = useState<Record<string, PassportList>>({});
    useEffect(() => {}, []);
    return (
        <Wrapper>
            <h1 className="font-bold mb-4 text-4xl">Records list</h1>
            <div className="text-center text-gray-500 p-24">
                <p>Loading...</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
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
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RegTime
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
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">30</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            New York
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">30</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            New York
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            Jane Smith
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">25</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            Los Angeles
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">30</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            New York
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            Bob Johnson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">40</td>
                        <td className="px-6 py-4 whitespace-nowrap">Chicago</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">30</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            New York
                        </td>
                    </tr>
                </tbody>
            </table>
        </Wrapper>
    );
};

export default Records;
