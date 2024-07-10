import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Election_Status_Class } from "@/constants";
import CreateCandidateForm from "./Partials/CreateCandidateForm";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import DeleteCandidateForm from "./Partials/DeleteCadidateForm";
import EditCandidateForm from "./Partials/EditCandidateForm";
import toast from "react-hot-toast";
import ViewPlatformModal from "./Partials/ViewPlatformModal";

export default function Index({ auth, candidates, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [activePositions, setActivePositions] = useState([]);
    const [candidateData, setCandidateData] = useState()
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewPlatformModal, setViewPlatformModal] = useState(false);

    useEffect(() => {
        fetchActivePositions()
    }, []);
    const fetchActivePositions = async () => {
        try {
            const response = await axios.get('/api/active-positions');
            setActivePositions(response.data);
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    };

    const handleCreateCandidate = () => {
        setCreateModalOpen(true);
    };

    const handleViewPlatform = (candidate) => {
        setCandidateData(c => (c = candidate));
        setViewPlatformModal(true);
    };

    const handleEditCandidate = (candidate) => {
        setCandidateData(c => (c = candidate));
        setEditModalOpen(true);
    };

    const handleDeleteCandidate = (candidate) => {
        setCandidateData(c => (c = candidate));
        setDeleteModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const closePlatformModal = () => {
        setViewPlatformModal(false);
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
        }
        if (queryParams[name] && !value) {
            delete queryParams[name];   
        }
        router.get(route('candidate.index'), queryParams);
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
        router.get(route('candidate.index'), queryParams);
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
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Candidates</h2>
                    <button type="button" onClick={handleCreateCandidate} className="bg-green-900 py-1 px-3 text-white rounded shadow transition-all hover:bg-green-700">
                        Add Candidate
                    </button>
                </div>
            }
        >
            <Head title="Candidates" />

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
                                            <th className="px-3 py-2">Image</th>
                                            <TableHeading name="name" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Name
                                            </TableHeading>
                                            <th className="px-3 py-2">Platform</th>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Created Date
                                            </TableHeading>
                                            <TableHeading name="updated_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Updated Date
                                            </TableHeading>
                                            <th className="px-3 py-2">Position Name</th>
                                            <th className="px-3 py-2">Election Name</th>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    {candidates.data.length > 0 ?
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
                                                        placeholder="Enter Candidate Name"
                                                        onBlur={e => searchFieldChanged('name', e.target.value)}
                                                        onKeyPress={e => onKeyPress('name', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2 text-right"></th>
                                            </tr>
                                        </thead>) : null
                                    }
                                    <tbody>
                                        {candidates.data.length > 0 ? (
                                            candidates.data.map(candidate => (
                                                <tr className="bg-white border-b" key={candidate.id}>
                                                    <td className="px-3 py-2">{candidate.id}</td>
                                                    <td className="px-3 py-2">
                                                        <img src={candidate.image_url} alt="profile" className="w-14 h-14 object-cover" />
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">{candidate.name}</td>
                                                    <td className="px-3 py-2">
                                                        <span className="p-2 rounded-md bg-green-900 text-gray-100 w-16 text-center cursor-pointer hover:bg-green-700" onClick={()=>handleViewPlatform(candidate)}>
                                                            <i className="fa-regular fa-xl fa-file-lines"></i>
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">{candidate.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{candidate.updated_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{candidate.position.name}</td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <div className="flex items-center justify-start gap-1">
                                                            <span
                                                                className={
                                                                    "min-w-[10px] min-h-[10px] rounded-full p-0 m-0 " +
                                                                    Election_Status_Class[candidate.position.election.is_active]
                                                                }></span>
                                                            <span>{candidate.position.election.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditCandidate(candidate)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeleteCandidate(candidate)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-3 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {candidates.data.length > 0 ? (
                                <Pagination links={candidates.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <ViewPlatformModal modalOpen={viewPlatformModal} closeModal={closePlatformModal} candidate={candidateData} />
            <CreateCandidateForm modalOpen={createModalOpen} closeModal={closeCreateModal} activePositions={activePositions} />
            <EditCandidateForm modalOpen={editModalOpen} closeModal={closeEditModal} activePositions={activePositions} candidate={candidateData} />
            <DeleteCandidateForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} candidate={candidateData} />
        </AdminAuthenticatedLayout>
    );
}