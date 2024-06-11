import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function CreateElectionForm({ modalOpen, closeModal }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        is_active: '',
        start_date: '',
        end_date: '',
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
    }
    const onSubmit = (e) => {
        e.preventDefault()
        post(route("election.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                closeModal()
            },
            onError: (errors) => handleErrors(errors),
        })
    }
    return (
        <Modal show={modalOpen} onClose={closeModal}>
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Create new election
                </h2>
                <div className="mt-4">
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
                        defaultValue=""
                        value={data.is_active}
                        onChange={e => setData('is_active', e.target.value)}
                    >
                        <option value="" hidden>Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </SelectInput>
                    <InputError message={errors.is_active} className="mt-2" />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>

                    <PrimaryButton type="submit" className="ms-3" disabled={processing}>
                        {processing ? <ThreeDots
                            visible={true}
                            height="10"
                            width="40"
                            color="#D1D5DB"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        /> : "Submit"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}