import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function EditElectionForm({ modalOpen, closeModal, election}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        is_active: '',
        start_date: '',
        end_date: '',
    })
    useEffect(()=>{
        if(election){
            setData({
                name: election.name,
                is_active: election.is_active,
                start_date: election.start_date,
                end_date: election.end_date,
            })
        }
    }, [election])
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
    const onSubmit = (e, id) => {
        e.preventDefault()
        put(route("election.update", id), {
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
            <form onSubmit={(e) => {onSubmit(e, election.id)}} className="p-6">
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
                        Submit
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}