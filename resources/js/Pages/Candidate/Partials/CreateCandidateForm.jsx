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
import { ThreeDots } from "react-loader-spinner";

export default function CreateCandidateForm({modalOpen, closeModal, activePositions}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        platform: '',
        image: '',
        position_id: '',
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
        post(route("candidate.store"), {
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
                    Create new candidate
                </h2>
                <div className="mt-4">
                    <InputLabel htmlFor="candidate_image" value="Candidate Image" />
                    <TextInput
                        type="file"
                        className="mt-1 block w-full p-2"
                        id="candidate_image"
                        name="image"
                        onChange={e => setData('image', e.target.files[0])}
                    />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="candidate_name" value="Candidate Name" />
                    <TextInput
                        type="text"
                        className="mt-1 block w-full"
                        id="candidate_name"
                        name="name"
                        value={data.name}
                        isFocused={true}
                        onChange={e => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="candidate_description" value="Candidate Platform" />
                    <Textarea
                        className="mt-1 block w-full"
                        id="candidate_description"
                        name="platform"
                        value={data.platform}
                        onChange={e => setData('platform', e.target.value)}
                    />
                    <InputError message={errors.platform} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="position_id" value="Positions" />
                    <SelectInput
                        className="mt-1 block w-full"
                        id="position_id"
                        name="position"
                        value={data.position_id}
                        onChange={e => setData('position_id', e.target.value)}
                    >
                        <option value="" hidden>Select Position From Active Election</option>
                        {activePositions
                            .filter(position => position.election.is_active) // Filter positions with active election
                            .map(position => (
                                <option key={position.id} value={position.id}>
                                    {position.name} - {position.election.name}
                                </option>
                            ))}
                    </SelectInput>
                    <InputError message={errors.position_id} className="mt-2" />
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