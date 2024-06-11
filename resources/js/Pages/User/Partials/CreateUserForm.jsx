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

export default function CreateUserForm({ modalOpen, closeModal, roles }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
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
        post(route("user.store"), {
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

    const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

    return (
        <Modal show={modalOpen} onClose={handleOnClose}>
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Create new user
                </h2>
                <>
                    <div className="mt-4">
                        <InputLabel htmlFor="user_name" value="User Name" />
                        <TextInput
                            type="text"
                            className="mt-1 block w-full"
                            id="user_name"
                            name="name"
                            value={data.name}
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="user_email" value="User Email" />
                        <TextInput
                            type="email"
                            className="mt-1 block w-full"
                            id="user_email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="user_role" value="User Role" />
                        <SelectInput
                            className="mt-1 block w-full"
                            id="user_role"
                            name="role"
                            defaultValue="staff"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="" hidden>Select Role</option>
                            {roles.map((role) => (
                                <option key={role.name} value={role.name}>
                                    {capitalize(role.name)}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.role} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="user_password" value="User Password" />
                        <TextInput
                            type="password"
                            className="mt-1 block w-full"
                            id="user_password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="user_password_confirmation" value="Confirm Password" />
                        <TextInput
                            type="password"
                            className="mt-1 block w-full"
                            id="user_password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </>
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