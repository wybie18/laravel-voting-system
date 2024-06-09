import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function CreatePositionForm({modalOpen, closeModal, activeElections}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        election_id: '',
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
        post(route("position.store"), {
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
                    Create new position
                </h2>
                <div className="mt-4">
                    <InputLabel htmlFor="position_name" value="Position Name" />
                    <TextInput
                        type="text"
                        className="mt-1 block w-full"
                        id="position_name"
                        name="name"
                        value={data.name}
                        isFocused={true}
                        onChange={e => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="election_id" value="Election" />
                    <SelectInput
                        className="mt-1 block w-full"
                        id="election_id"
                        name="election"
                        value={data.election_id}
                        onChange={e => setData('election_id', e.target.value)}
                    >
                        <option value="" hidden>Select Active Election</option>
                        {activeElections.map(election => (
                            <option key={election.id} value={election.id}>
                                {election.name}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError message={errors.election_id} className="mt-2" />
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