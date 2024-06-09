import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Election_Status_Class, Election_Status_Text_Map } from "@/constants";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteElectionForm from "./Partials/DeleteElectionForm";
import CreateElectionForm from "./Partials/CreateElectionForm";
import EditElectionForm from "./Partials/EditElectionForm";

export default function Index({ auth, elections, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [electionData, setElectionData] = useState()
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);

    const handleCreateElection = () => {
        setCreateModalOpen(true);
    };

    const handleEditElection = (election) => {
        setElectionData(e => (e = election));
        setEditModalOpen(true);
    };

    const handleElectionIdDeletion = (data) => {
        setElectionData(e => (e = data))
        setConfirmingDeletion(true); Link
    }

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
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
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('election.index'), queryParams);
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
        router.get(route('election.index'), queryParams);
    }

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Elections</h2>
                    <button type="button" onClick={handleCreateElection} className="bg-green-900 py-1 px-3 text-white rounded shadow transition-all hover:bg-green-700">
                        Add Election
                    </button>
                </div>
            }
        >
            <Head title="Elections" />

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
                                            <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Name
                                            </TableHeading>
                                            <TableHeading name="is_active" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Status
                                            </TableHeading>
                                            <TableHeading name="start_date" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Start Date
                                            </TableHeading>
                                            <TableHeading name="end_date" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                End Date
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
                                    {elections.data.length > 0 ?
                                        (<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                </th>
                                                <th className="px-3 py-2">
                                                    <TextInput
                                                        className="w-full"
                                                        defaultValue={queryParams.name}
                                                        placeholder="Enter Election Name"
                                                        onBlur={e => searchFieldChanged('name', e.target.value)}
                                                        onKeyPress={e => onKeyPress('name', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2">
                                                    <SelectInput
                                                        className="w-full"
                                                        defaultValue={queryParams.status}
                                                        onChange={e => searchFieldChanged('status', e.target.value)}
                                                    >
                                                        <option value="" selected hidden>Select Status</option>
                                                        <option value="">All</option>
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </SelectInput>
                                                </th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2 text-right"></th>
                                            </tr>
                                        </thead>) : null
                                    }
                                    <tbody>
                                        {elections.data.length > 0 ? (
                                            elections.data.map(election => (
                                                <tr className="bg-white border-b" key={election.id}>
                                                    <td className="px-3 py-2">{election.id}</td>
                                                    <td className="px-3 py-2">{election.name}</td>
                                                    <td className="px-3 py-2">
                                                        <span className={
                                                            "px-2 py-1 text-white rounded-md w-full " +
                                                            Election_Status_Class[election.is_active]
                                                        }>
                                                            {Election_Status_Text_Map[election.is_active]}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">{election.start_date}</td>
                                                    <td className="px-3 py-2 text-nowrap">{election.end_date}</td>
                                                    <td className="px-3 py-2 text-nowrap">{election.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{election.updated_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditElection(election)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleElectionIdDeletion(election)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-3 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {elections.data.length > 0 ? (
                                <Pagination links={elections.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <CreateElectionForm modalOpen={createModalOpen} closeModal={closeCreateModal} />
            <EditElectionForm modalOpen={editModalOpen} closeModal={closeEditModal} election={electionData} />
            <DeleteElectionForm election={electionData} confirmingDeletion={confirmingDeletion} closeModal={closeModal} />
        </AdminAuthenticatedLayout>
    )
}