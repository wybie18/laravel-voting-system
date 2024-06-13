import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function UploadVoterForm({ modalOpen, closeModal }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleErrors = (errors) => {
        if (errors) {
            let delay = 0;
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    setTimeout(() => {
                        toast.error(errors[key]);
                    }, delay);
                }
                delay += 150;
            }
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("voter.upload"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                closeModal();
            },
            onError: (errors) => handleErrors(errors),
        });
    };

    const handleOnClose = () => {
        reset();
        closeModal();
    }

    return (
        <Modal show={modalOpen} onClose={handleOnClose}>
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Upload Excel File
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Please upload an excel file containing voter information.
                </p>
                <h5 className="mt-2 mb-2 text-md font-medium text-gray-900">
                    Excel Template
                </h5>
                <a 
                    href="/template/excel/SFXC_Voter_Template.xlsx" 
                    download="SFXC_Voter_Template.xlsx" 
                    target="_blank"
                >
                    <SecondaryButton className="space-x-3">
                    <i className="fa-solid fa-lg fa-down-long"></i> <span>click here to download</span>
                    </SecondaryButton>
                </a>
                <div className="mt-4">
                    <InputLabel htmlFor="voter_file" value="Voter Excel File" />
                    <input
                        type="file"
                        className="mt-1 block w-full p-2 border rounded-md"
                        id="voter_file"
                        name="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={(e) => setData('file', e.target.files[0])}
                    />
                    <InputError message={errors.file} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={handleOnClose}>
                        Cancel
                    </SecondaryButton>

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
    );
}