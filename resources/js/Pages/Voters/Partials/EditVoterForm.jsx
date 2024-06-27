import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import TextInputData from "@/Components/TextInputData";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function EditVoterForm({modalOpen, closeModal, voter, departments, programs}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        department: '',
        program: '',
        year: '',
    })
    useEffect(() => {
        if(voter){
            setData({
                name: voter.name,
                email: voter.email,
                department: voter.department,
                program: voter.program,
                year: voter.year,
            });
        }
    }, [voter])
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
        put(route("voter.update", id), {
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
            <form onSubmit={(e) => onSubmit(e, voter.id)} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Edit voter
                </h2>
                <div className="mt-4">
                    <InputLabel htmlFor="voter_name" value="Voter Name" />
                    <TextInput
                        type="text"
                        className="mt-1 block w-full"
                        id="voter_name"
                        name="name"
                        value={data.name}
                        isFocused={true}
                        onChange={e => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="voter_email" value="Voter Email" />
                    <TextInput
                        type="email"
                        className="mt-1 block w-full"
                        id="voter_email"
                        name="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                        <InputLabel htmlFor="voter_department" value="Voter Department" />
                        <TextInputData
                            type="text"
                            className="mt-1 block w-full"
                            id="voter_department"
                            name="department"
                            value={data.department}
                            data={departments}
                            isFocused={true}
                            onChange={(e) => setData('department', e.target.value)}
                        />
                        <InputError message={errors.department} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="voter_program" value="Voter Program" />
                        <TextInputData
                            type="text"
                            className="mt-1 block w-full"
                            id="voter_program"
                            name="program"
                            value={data.program}
                            data={programs}
                            isFocused={true}
                            onChange={(e) => setData('program', e.target.value)}
                        />
                        <InputError message={errors.program} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="voter_year" value="Voter Year Level" />
                        <TextInput
                            type="number"
                            min="1"
                            max="5"
                            className="mt-1 block w-full"
                            id="voter_year"
                            name="year"
                            value={data.year}
                            isFocused={true}
                            onChange={(e) => setData('year', e.target.value)}
                        />
                        <InputError message={errors.year} className="mt-2" />
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