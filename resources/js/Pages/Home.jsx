import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import CustomLayout from '@/Layouts/CustomLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Home({ positions, candidates, elections, currectElectionId, success }) {
    const [openModal, setOpenModal] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);
    const [candidateName, setCandidateName] = useState('');
    const [candidatePlatform, setCandidatePlatform] = useState('');
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [emailValid, setEmailValid] = useState(null);
    const [selectionErrors, setSelectionErrors] = useState({});
    const formRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        election_id: currectElectionId,
        email: '',
        votes: []
    });

    const handleOpenModal = (candidate) => {
        setCandidateName(candidate.name);
        setCandidatePlatform(candidate.description);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const handlePreview = (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const selected = {};
        let valid = true;
        const newErrors = {};
        const votesArray = [];

        positions.forEach(position => {
            const candidateId = formData.get(position.name);
            if (!candidateId) {
                valid = false;
                newErrors[position.name] = 'Selection required';
            } else {
                selected[position.name] = candidates.data.find(candidate => candidate.id.toString() === candidateId);
                votesArray.push({
                    position_name: position.name,
                    candidate_id: candidateId
                });
            }
        });

        setSelectionErrors(newErrors);
        setData('votes', votesArray);

        if (valid && emailValid) {
            setSelectedCandidates(selected);
            setPreviewModal(true);
        } else if (!emailValid) {
            toast.error('Please enter a valid SFXC email');
        }
    };

    const closePreviewModal = () => {
        setPreviewModal(false);
    };

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

    const handleConfirm = () => {
        post(route('vote.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                formRef.current.reset();
                setSelectedCandidates({});
                setSelectionErrors({});
                setEmailValid(null);
                closePreviewModal()
            },
            onError: (errors) => handleErrors(errors)
        });
    };

    const checkEmail = async (email) => {
        try {
            const response = await axios.get(`/api/check-email?email=${email}`);
            setData('email', email);
            setEmailValid(response.data.exists);
        } catch (error) {
            console.error('Error checking email', error);
        }
    };

    const handleSelectionChange = (positionName) => {
        setSelectionErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[positionName];
            return newErrors;
        });
    };

    const handleSuccess = (success) => {
        if (success) {
            toast.success(success);
        }
    };

    useEffect(() => {
        handleSuccess(success);
    }, [success]);

    return (
        <CustomLayout
            header={<h1>Home</h1>}
            links={elections}
        >
            <Head>
                <title>Home</title>
            </Head>

            <div className="py-12">
                {positions.length === 0 ? (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                            <div className="p-6 text-gray-900">
                                <p>No active election found.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form id="election-form" className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6" onSubmit={handlePreview} ref={formRef}>
                        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                            <div className="p-6 text-gray-900">
                                <InputLabel htmlFor="voter_email">
                                    Your SFXC Email <span className='text-red-900'>*</span>
                                </InputLabel>
                                <TextInput
                                    type="email"
                                    id="voter_email"
                                    name="email"
                                    className="mt-4"
                                    value={data.email}
                                    onChange={e=>setData('email', e.target.value)}
                                    onBlur={e=>checkEmail(e.target.value)}
                                />
                                {emailValid === false && (
                                    <p className="text-red-500">Email is not registered.</p>
                                )}
                                <input type="hidden" name="election_id" value={currectElectionId} />
                            </div>
                        </div>
                        {positions.map(position => (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg" key={position.name}>
                                <div className="p-6 text-gray-900">
                                    <h2 className="text-2xl font-semibold text-gray-700">
                                        {position.name}
                                    </h2>
                                    <hr />
                                    <p className="mt-2 text-base text-gray-500">
                                        Select only one candidate
                                    </p>
                                    {candidates.data.filter(candidate => candidate.position.name === position.name).map(candidate => (
                                        <div className='mt-4 md:px-10 w-full border-t-2 border-b-2 py-2' key={candidate.id}>
                                            <div className="flex items-center justify-between overflow-hidden">
                                                <label className='md:space-x-10'>
                                                    <input
                                                        type="radio"
                                                        name={position.name}
                                                        value={candidate.id}
                                                        className='border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 m-2'
                                                        onChange={() => handleSelectionChange(position.name)}
                                                    />
                                                    <img
                                                        src={candidate.image_url}
                                                        alt="profile"
                                                        className='w-12 h-12 md:w-16 md:h-16 object-cover rounded-full inline'
                                                    />
                                                    <span className="ml-2 text-lg text-gray-700">
                                                        {candidate.name}
                                                    </span>
                                                </label>
                                                <PrimaryButton type="button" className='me-1' onClick={() => handleOpenModal(candidate)}>
                                                    Platform
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    ))}
                                    {selectionErrors[position.name] && (
                                        <p className="text-red-500">{selectionErrors[position.name]}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 flex justify-end">
                            <PrimaryButton type="submit" className='me-1'>
                                Preview
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </div>

            <Modal show={openModal} onClose={closeModal}>
                <div className='p-6'>
                    <h2 className="text-lg font-medium text-gray-900">
                        {candidateName} - Platform
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 indent-8">
                        {candidatePlatform}
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={previewModal} onClose={closePreviewModal}>
                <div className='p-6'>
                    <h2 className="text-lg font-medium text-gray-900">
                        Preview your selections
                    </h2>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold text-gray-700">
                            Your SFXC Email
                        </h3>
                        <p className="text-base text-gray-600">
                            {data.email}
                        </p>
                    </div>
                    {Object.keys(selectedCandidates).map(position => (
                        <div key={position} className="mt-4">
                            <h3 className="text-md font-semibold text-gray-700">
                                {position}
                            </h3>
                            <p className="text-base text-gray-600">
                                {selectedCandidates[position]?.name}
                            </p>
                        </div>
                    ))}
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closePreviewModal} className='mr-2'>Go Back</SecondaryButton>
                        <PrimaryButton onClick={handleConfirm} disabled={processing}>Confirm</PrimaryButton>
                    </div>
                </div>
            </Modal>
        </CustomLayout>
    );
}
