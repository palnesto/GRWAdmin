import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Dashboard = () => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const response = await axios.get("http://localhost:5000/admin/addresses");
            setSubmissions(response.data);
        };

        fetchSubmissions();
    }, []);

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(submissions.map((submission, index) => ({
            No: index + 1,
            'Email Address': submission.email,
            'Solana Address': submission.solanaAddress
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
        XLSX.writeFile(wb, 'submissions.xlsx');
    };

    return (
        <div className="p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
            <div className="bg-white shadow-lg rounded-lg p-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Submissions</h2>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded shadow"
                        onClick={downloadExcel}
                    >
                        Download Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">No.</th>
                                <th className="py-2 px-4 border text-start">Email Address</th>
                                <th className="py-2 px-4 border text-start">Solana Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-2 px-4 border text-center">No submissions found.</td>
                                </tr>
                            ) : (
                                submissions.map((submission, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border text-black text-center">{index + 1}</td>
                                        <td className="py-2 px-4 border text-black  text-start">{submission.email}</td>
                                        <td className="py-2 px-4 border text-start">{submission.solanaAddress}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
