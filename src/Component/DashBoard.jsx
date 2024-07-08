import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Dashboard = () => {
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState("all"); // Default to show all blogs

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const endpoints = [
                    { url: "https://rwbsol-server.vercel.app/admin/addresses", blogId: "blog1" },
                    { url: "https://rwbsol-server.vercel.app/admin/addresses2", blogId: "blog2" },
                    { url: "https://rwbsol-server.vercel.app/admin/addresses3", blogId: "blog3" },
                    { url: "https://rwbsol-server.vercel.app/admin/addresses4", blogId: "blog4" },
                    { url: "https://rwbsol-server.vercel.app/admin/addresses5", blogId: "blog5" },
                    { url: "https://rwbsol-server.vercel.app/admin/addresses6", blogId: "blog6" }
                ];

                const allData = await Promise.all(endpoints.map(endpoint =>
                    axios.get(endpoint.url).then(response =>
                        response.data.map(item => ({ ...item, blogId: endpoint.blogId }))
                    )
                ));

                // Flatten the array of arrays and sort by date
                const mergedData = allData.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                console.log("Fetched Data: ", mergedData); // Debugging line

                setAllSubmissions(mergedData);
                setFilteredSubmissions(mergedData); // Initially show all data
            } catch (error) {
                console.error("Error fetching submissions:", error);
            }
        };

        fetchSubmissions();
    }, []);

    useEffect(() => {
        if (selectedBlog === "all") {
            setFilteredSubmissions(allSubmissions);
        } else {
            const filteredData = allSubmissions.filter(submission => submission.blogId === selectedBlog);
            setFilteredSubmissions(filteredData);
        }
    }, [selectedBlog, allSubmissions]);

    const groupByDate = (data) => {
        return data.reduce((acc, item) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
    };

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredSubmissions.map((submission, index) => ({
            No: index + 1,
            'Email Address': submission.email,
            'Solana Address': submission.solanaAddress,
            'Date': new Date(submission.createdAt).toLocaleString()
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
        XLSX.writeFile(wb, 'submissions.xlsx');
    };

    const groupedSubmissions = groupByDate(filteredSubmissions);

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
                <div className="mb-4">
                    <label className="block mb-2 text-lg font-semibold">Select Blog:</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={selectedBlog}
                        onChange={(e) => setSelectedBlog(e.target.value)}
                    >
                        <option value="all">All Blogs</option>
                        <option value="blog1">Blog 1</option>
                        <option value="blog2">Blog 2</option>
                        <option value="blog3">Blog 3</option>
                        <option value="blog4">Blog 4</option>
                        <option value="blog5">Blog 5</option>
                        <option value="blog6">Blog 6</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">No.</th>
                                <th className="px-4 py-2 border text-start">Email Address</th>
                                <th className="px-4 py-2 border text-start">Solana Address</th>
                                <th className="px-4 py-2 border text-start">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedSubmissions).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-2 text-center border">No submissions found.</td>
                                </tr>
                            ) : (
                                Object.keys(groupedSubmissions).map((date) => (
                                    <React.Fragment key={date}>
                                        <tr>
                                            <td colSpan="4" className="px-4 py-2 font-bold text-center bg-gray-100 border">{date}</td>
                                        </tr>
                                        {groupedSubmissions[date].map((submission, subIndex) => (
                                            <tr key={subIndex} className="hover:bg-gray-100">
                                                <td className="px-4 py-2 text-center text-black border">{subIndex + 1}</td>
                                                <td className="px-4 py-2 text-black border text-start">{submission.email}</td>
                                                <td className="px-4 py-2 border text-start">{submission.solanaAddress}</td>
                                                <td className="px-4 py-2 border text-start">{new Date(submission.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
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
