import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Election_Status_Class } from "@/constants";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CreatePositionForm from "./Partials/CreatePositionForm";
import axios from "axios";
import EditPositionForm from "./Partials/EditPositionForm";
import toast from "react-hot-toast";
import DeletePositionForm from "./Partials/DeletePositionForm";

export default function Index({ auth, positions, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [activeElections, setActiveElections] = useState([]);
    const [positionData, setPositionData] = useState()
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchActiveElections();
    }, []);

    const fetchActiveElections = async () => {
        try {
            const response = await axios.get('/api/active-elections');
            setActiveElections(response.data);
        } catch (error) {
            console.error('Error fetching active elections:', error);
        }
    };

    const handleCreatePosition = () => {
        setCreateModalOpen(true);
    };

    const handleEditPosition = (position) => {
        setPositionData(p => (p = position));
        setEditModalOpen(true);
    };

    const handleDeletePosition = (position) => {
        setPositionData(p => (p = position));
        setDeleteModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleSuccess = (success) => {
        if (success) {
            toast.success(success);
        }
    };

    useEffect(() => {
        handleSuccess(success);
    }, [success]);

    const searchFieldChanged = (name, value) => {
        if (!value && !queryParams[name]) {
            return;
        }
        if (value) {
            queryParams[name] = value;
        } 
        if(queryParams[name] && !value) {
            delete queryParams[name];
           
        }
        router.get(route('position.index'), queryParams);
    }

    const onKeyPress = (name, e) => {
        if (e.key != 'Enter') return;
        searchFieldChanged(name, e.target.value)
    }

    const sortChange = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            }
            else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('position.index'), queryParams);
    }

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Positions</h2>
                    <button type="button" onClick={handleCreatePosition} className="bg-green-900 py-1 px-3 text-white rounded shadow transition-all hover:bg-green-700">
                        Add Position
                    </button>
                </div>
            }
        >
            <Head title="Positions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                ID
                                            </TableHeading>
                                            <th className="px-3 py-2">Election name</th>
                                            <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Name
                                            </TableHeading>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Created Date
                                            </TableHeading>
                                            <TableHeading name="updated_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Updated Date
                                            </TableHeading>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    {positions.data.length > 0 ?
                                        (<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                </th>
                                                <th className="px-3 py-2">
                                                </th>
                                                <th className="px-3 py-2">
                                                    <TextInput
                                                        className="w-full"
                                                        defaultValue={queryParams.name}
                                                        placeholder="Enter Position Name"
                                                        onBlur={e => searchFieldChanged('name', e.target.value)}
                                                        onKeyPress={e => onKeyPress('name', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2 text-right"></th>
                                            </tr>
                                        </thead>) : null
                                    }
                                    <tbody>
                                        {positions.data.length > 0 ? (
                                            positions.data.map(position => (
                                                <tr className="bg-white border-b" key={position.id}>
                                                    <td className="px-3 py-2">{position.id}</td>
                                                    <td className="px-3 py-2">
                                                        <div className="flex items-center justify-start gap-1">
                                                            <span
                                                                className={
                                                                    "min-w-[10px] min-h-[10px] rounded-full p-0 m-0 " +
                                                                    Election_Status_Class[position.election.is_active]
                                                                }></span>
                                                            <span>{position.election.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">{position.name}</td>
                                                    <td className="px-3 py-2">{position.created_at}</td>
                                                    <td className="px-3 py-2">{position.updated_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditPosition(position)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeletePosition(position)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-3 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {positions.data.length > 0 ? (
                                <Pagination links={positions.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <CreatePositionForm modalOpen={createModalOpen} closeModal={closeCreateModal} activeElections={activeElections} />
            <EditPositionForm modalOpen={editModalOpen} closeModal={closeEditModal} activeElections={activeElections} position={positionData} />
            <DeletePositionForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} position={positionData} />
        </AdminAuthenticatedLayout>
    )
}