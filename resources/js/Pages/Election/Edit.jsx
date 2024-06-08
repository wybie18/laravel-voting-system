import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function Edit({ auth, election }) {

    const { data, setData, put, errors, reset } = useForm({
        name: election.name || '',
        is_active: election.is_active == 0 ? 0 : 1,
        start_date: election.start_date || '',
        end_date: election.end_date || '',
    })
    const handleErrors = (errors) => {
        if (errors) {
            let delay = 0
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    setTimeout(() => {
                        toast.error(errors[key])
                    }, delay)
                }
                delay += 150
            }
        }
    };
    const onSubmit = (e) => {
        e.preventDefault()
        put(route("election.update", election.id), {
            onError: (errors) => handleErrors(errors),
        });
    }

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit election for "{election.name}"</h2>}
        >
            <Head title="Edit Election" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <div>
                                <InputLabel htmlFor="election_name" value="Election Name" />
                                <TextInput
                                    type="text"
                                    className="mt-1 block w-full"
                                    id="election_name"
                                    name="name"
                                    value={data.name}
                                    isFocused={true}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="election_start_date" value="Election Start Date" />
                                <TextInput
                                    type="date"
                                    className="mt-1 block w-full"
                                    id="election_start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                />
                                <InputError message={errors.start_date} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="election_end_date" value="Election End Date" />
                                <TextInput
                                    type="date"
                                    className="mt-1 block w-full"
                                    id="election_end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="election_status" value="Election Status" />
                                <SelectInput
                                    className="mt-1 block w-full"
                                    id="election_status"
                                    name="status"
                                    value={data.is_active}
                                    onChange={e => setData('is_active', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </SelectInput>
                                <InputError message={errors.is_active} className="mt-2" />
                            </div>
                            <div className="mt-4 text-right">
                                <Link href={route("election.index")} className="mr-2">
                                    <SecondaryButton>
                                        Cancel
                                    </SecondaryButton>
                                </Link>
                                <PrimaryButton type="submit">
                                    Submit
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}