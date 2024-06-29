import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';  // Importing dayjs for date formatting and manipulation

const Dashboard = () => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get("https://rwbsol-server.vercel.app/admin/addresses");
                const data = response.data;

                if (Array.isArray(data)) {
                    setSubmissions(data);
                } else {
                    console.error("Data is not an array:", data);
                }
            } catch (error) {
                console.error("Error fetching submissions:", error);
            }
        };

        fetchSubmissions();
    }, []);

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(submissions.map((submission, index) => ({
            No: index + 1,
            'Email Address': submission.email,
            'Solana Address': submission.solanaAddress,
            'Date': new Date(submission.createdAt).toLocaleString()
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
        XLSX.writeFile(wb, 'submissions.xlsx');
    };

    const groupByDate = (data) => {
        return data.reduce((acc, curr) => {
            const date = dayjs(curr.createdAt).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(curr);
            return acc;
        }, {});
    };

    const groupedSubmissions = groupByDate(submissions);

    return (
        <div className="min-h-screen p-8">
            <h1 className="mb-8 text-3xl font-bold text-center">Admin Dashboard</h1>
            <div className="p-20 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Submissions</h2>
                    <button
                        className="px-4 py-2 text-white bg-blue-500 rounded shadow"
                        onClick={downloadExcel}
                    >
                        Download Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {Object.keys(groupedSubmissions).length === 0 ? (
                        <p className="px-4 py-2 text-center border">No submissions found.</p>
                    ) : (
                        Object.keys(groupedSubmissions).map((date, index) => (
                            <div key={index} className="mb-8">
                                <h3 className="mb-4 text-xl font-semibold">{date}</h3>
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">No.</th>
                                            <th className="px-4 py-2 border text-start">Email Address</th>
                                            <th className="px-4 py-2 border text-start">Solana Address</th>
                                            <th className="px-4 py-2 border text-start">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedSubmissions[date].map((submission, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="px-4 py-2 text-center text-black border">{index + 1}</td>
                                                <td className="px-4 py-2 text-black border text-start">{submission.email}</td>
                                                <td className="px-4 py-2 border text-start">{submission.solanaAddress}</td>
                                                <td className="px-4 py-2 border text-start">{dayjs(submission.createdAt).format('HH:mm:ss')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
