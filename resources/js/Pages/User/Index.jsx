import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import TextInput from '@/Components/TextInput';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CreateUserForm from './Partials/CreateUserForm';
import EditUserForm from './Partials/EditUserForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Index({ auth, users, roles, queryParams = null, success }) {
    queryParams = queryParams || {};
    const [userData, setUserData] = useState();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleCreateUser = () => {
        setCreateModalOpen(true);
    };

    const handleEditUser = (user) => {
        setUserData(u => (u = user));
        setEditModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setUserData(u => (u = user));
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
        router.get(route('user.index'), queryParams);
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
        router.get(route('user.index'), queryParams);
    }

    const handleSuccess = (success) => {
        if (success) {
            toast.success(success);
        }
    };

    useEffect(() => {
        handleSuccess(success);
    }, [success]);

    const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>
                    <button type="button" onClick={handleCreateUser} className="bg-green-900 py-1 px-3 me-2 text-white rounded shadow transition-all hover:bg-green-700">
                        Add User
                    </button>

                </div>
            }
        >
            <Head title="Dashboard" />

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
                                            <TableHeading name="email" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Email
                                            </TableHeading>
                                            <th className="px-3 py-2">Role</th>
                                            <TableHeading name="created_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Created Date
                                            </TableHeading>
                                            <TableHeading name="updated_at" sort_field={queryParams.sort_field} sort_direction={queryParams.sort_direction} sortChange={sortChange}>
                                                Updated Date
                                            </TableHeading>
                                            <th className="px-3 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    {users.data.length > 0 ?
                                        (<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b-2 border-gray-500">
                                            <tr className="text-nowrap">
                                                <th className="px-3 py-2">
                                                </th>
                                                <th className="px-3 py-2">
                                                    <TextInput
                                                        className="w-full"
                                                        defaultValue={queryParams.name}
                                                        placeholder="Enter User Name"
                                                        onBlur={e => searchFieldChanged('name', e.target.value)}
                                                        onKeyPress={e => onKeyPress('name', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2">
                                                    <TextInput
                                                        className="w-full"
                                                        defaultValue={queryParams.email}
                                                        placeholder="Enter User Email"
                                                        onBlur={e => searchFieldChanged('email', e.target.value)}
                                                        onKeyPress={e => onKeyPress('email', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2 text-right"></th>
                                            </tr>
                                        </thead>) : null
                                    }
                                    <tbody>
                                        {users.data.length > 0 ? (
                                            users.data.map(user => (
                                                <tr className="bg-white border-b" key={user.id}>
                                                    <td className="px-3 py-2">{user.id}</td>
                                                    <td className="px-3 py-2 text-nowrap">{user.name}</td>
                                                    <td className="px-3 py-2">{user.email}</td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {capitalize(user.roles.join(', '))}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">{user.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{user.updated_at}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <span className="font-medium text-blue-600 hover:underline mx-1 cursor-pointer" onClick={() => handleEditUser(user)}>
                                                            Edit
                                                        </span>
                                                        <span className="font-medium text-red-600 hover:underline mx-1 cursor-pointer" onClick={() => handleDeleteUser(user)}>
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-3 py-2 text-center">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {users.data.length > 0 ? (
                                <Pagination links={users.meta.links} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <CreateUserForm modalOpen={createModalOpen} closeModal={closeCreateModal} roles={roles}/>
            <EditUserForm modalOpen={editModalOpen} closeModal={closeEditModal} user={userData} roles={roles}/>
            <DeleteUserForm modalOpen={deleteModalOpen} closeModal={closeDeleteModal} user={userData} />
        </AdminAuthenticatedLayout>
    );
}
