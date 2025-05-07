import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateVoterForm from "./Partials/CreateVoterForm";
import DeleteVoterForm from "./Partials/DeleteVoterForm";
import EditVoterForm from "./Partials/EditVoterForm";
import UploadVoterForm from "./Partials/UploadVoterForm";

export default function Index({ auth, voters, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [voterData, setVoterData] = useState();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleCreateVoter = () => {
        setCreateModalOpen(true);
    };
    const handleUploadVoter = () => {
        setUploadModalOpen(true);
    };

    const handleEditVoter = (voter) => {
        setVoterData(v => (v = voter));
        setEditModalOpen(true);
    };

    const handleDeleteVoter = (voter) => {
        setVoterData(v => (v = voter));
        setDeleteModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };
    const closeUploadModal = () => {
        setUploadModalOpen(false);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const searchFieldChanged = (name, value) => {
        if(!value && !queryParams[name]){
            return;
        }
        if (value) {
            queryParams[name] = value;
            if (name === 'name' && queryParams.email) {
                delete queryParams.email;
            } else if (name === 'email' && queryParams.name) {
                delete queryParams.name;
            }
        }
        if (queryParams[name] && !value) {
            delete queryParams[name];
        }
        router.get(route('voter.index'), queryParams);
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
        router.get(route('voter.index'), queryParams);
    }

    const handleSuccess = (success) => {
        if (success) {
            toast.success(success);
        }
    };

    useEffect(() => {
        handleSuccess(success);
    }, [success]);

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Voters</h2>
                    <div>
                        <button type="button" onClick={handleCreateVoter} className="bg-green-900 py-1 px-3 me-2 text-white rounded shadow transition-all hover:bg-green-700">
                            Add Voter
                        </button>
                        <button type="button" onClick={handleUploadVoter} className="bg-green-900 py-1 px-3 text-white rounded shadow transition-all hover:bg-green-700">
                            <i className="fa-solid fa-upload"></i>
                        </button>
                    </div>

                </div>
            }
        >
            <Head title="Voters" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center justify-end pb-2">
                                <a href={route('voter.export')} target="_black" className="bg-green-900 py-1 px-3 text-white rounded shadow transition-all hover:bg-green-700">Export</a>
                            </div>
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <TableHeading name="id" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                ID
                                            </TableHeading>
                                            <TableHeading name="email" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Email
                                            </TableHeading>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    {voters.data.length > 0 ?
                                        (<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                </th>
                                                <th className="px-3 py-2">
                                                    <TextInput
                                                        className="w-full"
                                                        defaultValue={queryParams.name}
                                                        placeholder="Enter Voter Email"
                                                        onBlur={e => searchFieldChanged('email', e.target.value)}
                                                        onKeyPress={e => onKeyPress('email', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2 text-right"></th>
                                            </tr>
                                        </thead>) : null
                                    }
                                    <tbody>
                                        {voters.data.length > 0 ? (
                                            voters.data.map(voter => (
                                                <tr className="bg-white border-b" key={voter.id}>
                                                    <td className="px-3 py-2">{voter.id}</td>
                                                    <td className="px-3 py-2">{voter.email}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditVoter(voter)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeleteVoter(voter)}>
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
                            {voters.data.length > 0 ? (
                                <Pagination links={voters.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <CreateVoterForm modalOpen={createModalOpen} closeModal={closeCreateModal}/>
            <UploadVoterForm modalOpen={uploadModalOpen} closeModal={closeUploadModal} />
            <EditVoterForm modalOpen={editModalOpen} closeModal={closeEditModal} voter={voterData}/>
            <DeleteVoterForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} voter={voterData} />
        </AdminAuthenticatedLayout>
    )
}