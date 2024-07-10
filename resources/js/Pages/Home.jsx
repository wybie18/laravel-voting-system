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
import { ThreeDots } from 'react-loader-spinner';
import ScrollUpAnimation from '@/Components/ScrollUpAnimation';
import ScrollRightAnimation from '@/Components/ScrollRightAnimation';

export default function Home({ positions, candidates, elections, currectElectionId, success }) {
    const electionName = elections.filter(election => election.id == currectElectionId).map(election => election.name)
    const [openModal, setOpenModal] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);
    const [candidateName, setCandidateName] = useState('');
    const [candidateImage, setCandidateImage] = useState('');
    const [candidatePosition, setCandidatePosition] = useState('');
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
        setCandidatePosition(candidate.position.name);
        setCandidatePlatform(candidate.platform);
        setCandidateImage(candidate.image_url)
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
            header={
                <h1>{electionName} Election</h1>
            }
            links={elections}
        >
            <Head>
                <title>Home</title>
            </Head>

            <div className="py-12">
                {electionName == '' ? (
                    <ScrollUpAnimation>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                            <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                                <div className="p-6 text-gray-900">
                                    <div class="p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
                                        {elections.length === 0 ?
                                            <span><span className='font-semibold'>Election Update:</span> No current elections available. Stay tuned for upcoming polls!</span> :
                                            <span><span className='font-semibold'>Oops!</span> It looks like the election you're trying to access doesn't exist. Please check the URL or navigate back to the homepage.</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollUpAnimation>
                ) : positions.length === 0 ? (
                    <ScrollUpAnimation>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                            <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                                <div className="p-6 text-gray-900">
                                    <div class="p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
                                        <span><span className='font-semibold'>Notice to Voters:</span> We currently have no candidates listed for this election. Candidate nominations may be underway, so please stay tuned for updates.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollUpAnimation>
                ) : (
                    <form id="election-form" className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6" onSubmit={handlePreview} ref={formRef}>
                        <ScrollUpAnimation>
                            <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                                <div className="p-6 text-gray-900 max-w-96">
                                    <InputLabel htmlFor="voter_email">
                                        Your SFXC Email <span className='text-red-900'>*</span>
                                    </InputLabel>
                                    <TextInput
                                        type="email"
                                        id="voter_email"
                                        name="email"
                                        className="mt-4 w-full"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        onBlur={e => checkEmail(e.target.value)}
                                    />
                                    {emailValid === false && (
                                        <p className="text-red-500">Email is not registered.</p>
                                    )}
                                    <input type="hidden" name="election_id" value={currectElectionId} />
                                </div>
                            </div>
                        </ScrollUpAnimation>
                        {positions.map(position => (
                            <ScrollUpAnimation key={position.name}>
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg" >
                                    <div className="p-6 text-gray-900">
                                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                                            {position.name}
                                        </h2>
                                        <hr />
                                        <p className="mt-2 text-base text-gray-500">
                                            Select only one candidate
                                        </p>
                                        {candidates.data.filter(candidate => candidate.position.name === position.name).map(candidate => (
                                            <ScrollRightAnimation key={candidate.id}>
                                                <div className='mt-4 md:px-10 w-full border-t-2 border-b-2 py-2' >
                                                    <div className="flex items-center justify-between overflow-hidden">
                                                        <label className='md:space-x-10 flex items-center justify-center'>
                                                            <input
                                                                type="radio"
                                                                name={position.name}
                                                                value={candidate.id}
                                                                className='border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 mr-2 sm:m-2'
                                                                onChange={() => handleSelectionChange(position.name)}
                                                            />
                                                            <img
                                                                src={candidate.image_url}
                                                                alt=""
                                                                className='w-10 h-10 md:w-16 md:h-16 object-cover rounded-full inline'
                                                            />
                                                            <span className={`ml-2 text-sm sm:text-md lg:text-lg text-gray-700`}>
                                                                {candidate.name}
                                                            </span>
                                                        </label>
                                                        <span className="sm:py-1 sm:px-2 rounded-md sm:bg-green-900 text-green-900 sm:text-gray-100 text-center cursor-pointer sm:hover:bg-green-700" onClick={() => handleOpenModal(candidate)}>
                                                            <i className="fa-solid fa-md fa-magnifying-glass inline"></i>
                                                            <span className="ml-2 hidden sm:inline">
                                                                Platform
                                                            </span>
                                                        </span>
                                                        {/* <PrimaryButton type="button" className='me-1' onClick={() => handleOpenModal(candidate)}>
                                                    Platform
                                                </PrimaryButton> */}
                                                    </div>
                                                </div>
                                            </ScrollRightAnimation>
                                        ))}
                                        {selectionErrors[position.name] && (
                                            <p className="text-red-500 mt-4">{selectionErrors[position.name]}</p>
                                        )}
                                    </div>
                                </div>
                            </ScrollUpAnimation>
                        ))}
                        <div className="mt-6 flex justify-end">
                            <ScrollUpAnimation>
                                <PrimaryButton type="submit" className='me-1'>
                                    Submit
                                </PrimaryButton>
                            </ScrollUpAnimation>
                        </div>
                    </form>
                )}
            </div>
            <Modal show={openModal} onClose={closeModal}>
                <div className='p-6'>
                    <div className="flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl mx-auto">
                        <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={candidateImage} alt="profile" />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{electionName}</h5>
                            <h5 className="mb-2 text-sm">{candidateName} {candidatePosition}</h5>
                            <p className="mb-3 font-normal text-gray-700">{candidatePlatform}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
                    </div>
                </div>
            </Modal>

            <Modal show={previewModal} onClose={closePreviewModal}>
                <div className='p-6'>
                    <h2 className="text-lg font-medium text-gray-900">
                        Confirm your selections
                    </h2>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold text-gray-700">
                            SFXC Email
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
                    <div class="p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
                        <span className='font-medium'>Please note:</span> Once your vote is submitted, it cannot be modified or updated. Ensure your choice is final before confirming.
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closePreviewModal} className='mr-2'>Go Back</SecondaryButton>
                        <PrimaryButton onClick={handleConfirm} disabled={processing}>
                            {processing ? <ThreeDots
                                visible={true}
                                height="10"
                                width="40"
                                color="#4fa94d"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            /> : "Confirm"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </CustomLayout>
    );
}
