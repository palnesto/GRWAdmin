import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchAddresses = async () => {
            const response = await axios.get("http://localhost:5000/admin/addresses");
            setAddresses([...new Set(response.data)]); // Ensure addresses are unique
        };

        fetchAddresses();
    }, []);

    return (
        <div className="p-8  min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
            <div className="bg-white shadow-lg rounded-lg p-20">
                <h2 className="text-2xl font-semibold mb-6">Solana Addresses</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">No.</th>
                                <th className="py-2 px-4 border text-start">Solana Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addresses.map((address, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                                    <td className="py-2 px-4 border text-start">{address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
