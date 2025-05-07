import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import CustomLayout from "@/Layouts/CustomLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import ScrollUpAnimation from "@/Components/ScrollUpAnimation";
import ScrollRightAnimation from "@/Components/ScrollRightAnimation";
import { router } from "@inertiajs/react";

export default function Home({
    positions,
    candidates,
    elections,
    currectElectionId,
    success,
}) {
    const election = elections.find(
        (election) => election.id == currectElectionId
    );
    const electionImageUrl = election ? election.image_url : null;
    const electionName = election ? election.name : "";
    const [openModal, setOpenModal] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);
    const [candidateName, setCandidateName] = useState("");
    const [candidateImage, setCandidateImage] = useState("");
    const [candidatePosition, setCandidatePosition] = useState("");
    const [candidatePlatform, setCandidatePlatform] = useState("");
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [emailValid, setEmailValid] = useState(null);
    const [selectionErrors, setSelectionErrors] = useState({});
    const formRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        election_id: currectElectionId,
        email: "",
        votes: [],
    });

    const handleOpenModal = (candidate) => {
        setCandidateName(candidate.name);
        setCandidatePosition(candidate.position.name);
        setCandidatePlatform(candidate.platform);
        setCandidateImage(candidate.image_url);
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

        positions.forEach((position) => {
            const candidateId = formData.get(position.name);
            if (!candidateId) {
                valid = false;
                newErrors[position.name] = "Selection required";
            } else {
                selected[position.name] = candidates.data.find(
                    (candidate) => candidate.id.toString() === candidateId
                );
                votesArray.push({
                    position_name: position.name,
                    candidate_id: parseInt(candidateId, 10), // Ensure ID is an integer
                });
            }
        });

        setSelectionErrors(newErrors);
        setData("votes", votesArray);

        if (valid && emailValid) {
            setSelectedCandidates(selected);
            setPreviewModal(true);
        } else if (!emailValid) {
            toast.error("Please enter a valid SFXC email");
        }
    };

    const closePreviewModal = () => {
        setPreviewModal(false);
    };

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

    const handleConfirm = () => {
        // Use the post function from useForm directly instead of router.post
        post(route("vote.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                formRef.current.reset();
                setSelectedCandidates({});
                setSelectionErrors({});
                setEmailValid(null);
                closePreviewModal();
                toast.success("Your vote has been submitted successfully!");
            },
            onError: (errors) => handleErrors(errors),
        });
    };

    const checkEmail = async (email) => {
        try {
            const response = await axios.get(`/api/check-email?email=${email}`);
            setData("email", email);
            setEmailValid(response.data.exists);
        } catch (error) {
            console.error("Error checking email", error);
            setEmailValid(false);
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
                <div className="flex items-center justify-start gap-x-3">
                    {electionImageUrl && (
                        <img
                            src={"/storage/" + electionImageUrl}
                            alt="Election logo"
                            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full shadow-md border-2 border-green-100"
                        />
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold text-green-800">
                        {electionName}
                    </h1>
                </div>
            }
            links={elections}
        >
            <Head>
                <title>{electionName || "Voting System"}</title>
            </Head>

            <div className="py-8 md:py-12 px-4">
                {electionName == "" ? (
                    <ScrollUpAnimation>
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
                                <div className="p-6 text-gray-900">
                                    <div
                                        className="p-5 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 border-l-4 border-yellow-400"
                                        role="alert"
                                    >
                                        {elections.length === 0 ? (
                                            <span>
                                                <span className="font-semibold">
                                                    Notice:
                                                </span>{" "}
                                                No current elections available.
                                                Stay tuned for upcoming polls!
                                            </span>
                                        ) : (
                                            <span>
                                                <span className="font-semibold">
                                                    Oops!
                                                </span>{" "}
                                                It looks like the election
                                                you're trying to access doesn't
                                                exist. Please check the URL or
                                                navigate back to the homepage.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollUpAnimation>
                ) : positions.length === 0 ? (
                    <ScrollUpAnimation>
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
                                <div className="p-6 text-gray-900">
                                    <div
                                        className="p-5 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 border-l-4 border-yellow-400"
                                        role="alert"
                                    >
                                        <span>
                                            <span className="font-semibold">
                                                Notice:
                                            </span>{" "}
                                            We currently have no candidates
                                            listed for this election. Candidate
                                            nominations may be underway, so
                                            please stay tuned for updates.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollUpAnimation>
                ) : (
                    <form
                        id="election-form"
                        className="max-w-4xl mx-auto space-y-6"
                        onSubmit={handlePreview}
                        ref={formRef}
                    >
                        <ScrollUpAnimation>
                            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 transition-all hover:shadow-xl">
                                <div className="p-6 text-gray-900">
                                    <h2 className="text-xl font-semibold text-green-800 mb-4">
                                        Voter Information
                                    </h2>
                                    <div className="max-w-md">
                                        <InputLabel
                                            htmlFor="voter_email"
                                            className="text-base font-medium text-gray-700"
                                        >
                                            SFXC Email{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </InputLabel>
                                        <TextInput
                                            type="email"
                                            id="voter_email"
                                            name="email"
                                            className="mt-2 w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all"
                                            placeholder="Enter your SFXC email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            onBlur={(e) =>
                                                checkEmail(e.target.value)
                                            }
                                            required
                                        />
                                        {emailValid === false && (
                                            <p className="text-red-500 mt-2 text-sm">
                                                This email is not registered in
                                                our system.
                                            </p>
                                        )}
                                        {emailValid === true && (
                                            <p className="text-green-600 mt-2 text-sm">
                                                Email verified successfully.
                                            </p>
                                        )}
                                        <input
                                            type="hidden"
                                            name="election_id"
                                            value={currectElectionId}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ScrollUpAnimation>

                        {positions.map((position) => (
                            <ScrollUpAnimation key={position.name}>
                                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 transition-all hover:shadow-xl">
                                    <div className="p-6 text-gray-900">
                                        <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-2">
                                            {position.name}
                                        </h2>
                                        <div className="h-1 w-20 bg-green-600 rounded mb-4"></div>
                                        <p className="mb-6 text-base text-gray-600 italic">
                                            Select only one candidate for this
                                            position
                                        </p>

                                        <div className="space-y-4">
                                            {candidates.data
                                                .filter(
                                                    (candidate) =>
                                                        candidate.position
                                                            .name ===
                                                        position.name
                                                )
                                                .map((candidate) => (
                                                    <ScrollRightAnimation
                                                        key={candidate.id}
                                                    >
                                                        <div className="rounded-lg border border-gray-200 hover:border-green-300 transition-all hover:shadow-md bg-white">
                                                            <label className="flex items-center p-4 cursor-pointer w-full">
                                                                <div className="flex-shrink-0 mr-4">
                                                                    <input
                                                                        type="radio"
                                                                        name={
                                                                            position.name
                                                                        }
                                                                        value={
                                                                            candidate.id
                                                                        }
                                                                        className="h-5 w-5 border-gray-300 text-green-600 focus:ring-green-500"
                                                                        onChange={() =>
                                                                            handleSelectionChange(
                                                                                position.name
                                                                            )
                                                                        }
                                                                        required
                                                                    />
                                                                </div>

                                                                <div className="flex items-center flex-grow">
                                                                    <img
                                                                        src={
                                                                            candidate.image_url ||
                                                                            "/placeholder.svg"
                                                                        }
                                                                        alt={
                                                                            candidate.name
                                                                        }
                                                                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border-2 border-green-100 mr-4"
                                                                    />
                                                                    <span className="text-base md:text-lg font-medium text-gray-800">
                                                                        {
                                                                            candidate.name
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleOpenModal(
                                                                            candidate
                                                                        );
                                                                    }}
                                                                    className="ml-auto flex-shrink-0 py-2 px-4 rounded-md bg-green-700 text-white hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                                >
                                                                    <span className="hidden sm:inline mr-1">
                                                                        View
                                                                    </span>
                                                                    <i className="fa-solid fa-magnifying-glass"></i>
                                                                </button>
                                                            </label>
                                                        </div>
                                                    </ScrollRightAnimation>
                                                ))}
                                        </div>

                                        {selectionErrors[position.name] && (
                                            <p className="text-red-500 mt-4 bg-red-50 p-3 rounded-md border-l-4 border-red-500">
                                                {selectionErrors[position.name]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </ScrollUpAnimation>
                        ))}

                        <div className="mt-8 flex justify-end">
                            <ScrollUpAnimation>
                                <PrimaryButton
                                    type="submit"
                                    className="py-3 px-8 bg-green-700 hover:bg-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Review & Submit
                                </PrimaryButton>
                            </ScrollUpAnimation>
                        </div>
                    </form>
                )}
            </div>

            {/* Candidate Platform Modal */}
            <Modal show={openModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">
                        Candidate Platform
                    </h2>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-green-50">
                                <img
                                    className="object-cover w-full h-64 md:h-full"
                                    src={candidateImage || "/placeholder.svg"}
                                    alt={candidateName}
                                />
                            </div>
                            <div className="md:w-2/3 p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {candidateName}
                                    </h3>
                                    <p className="text-green-700 font-medium">
                                        {candidatePosition}
                                    </p>
                                </div>

                                <div className="h-0.5 w-16 bg-green-600 mb-4"></div>

                                <div className="prose max-w-none">
                                    <h4 className="text-lg font-semibold mb-2">
                                        Platform & Vision
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {candidatePlatform}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton
                            onClick={closeModal}
                            className="py-2 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Close
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={previewModal} onClose={closePreviewModal}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">
                        Confirm Your Vote
                    </h2>

                    <div className="bg-green-50 rounded-lg p-5 mb-6 border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Voter Information
                        </h3>
                        <p className="text-base text-gray-700 font-medium">
                            {data.email}
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Your Selections
                        </h3>

                        {Object.keys(selectedCandidates).map((position) => (
                            <div
                                key={position}
                                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                            >
                                <h4 className="text-base font-medium text-green-700">
                                    {position}
                                </h4>
                                <p className="text-lg font-semibold text-gray-800">
                                    {selectedCandidates[position]?.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div
                        className="p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 border-l-4 border-yellow-500"
                        role="alert"
                    >
                        <span className="font-medium">Please note:</span> Once
                        your vote is submitted, it cannot be modified or
                        updated. Ensure your choice is final before confirming.
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={closePreviewModal}
                            className="py-2 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Go Back
                        </SecondaryButton>

                        <PrimaryButton
                            onClick={handleConfirm}
                            disabled={processing}
                            className="py-2 px-6 bg-green-700 hover:bg-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <ThreeDots
                                    visible={true}
                                    height="10"
                                    width="40"
                                    color="#ffffff"
                                    radius="9"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            ) : (
                                "Confirm Vote"
                            )}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </CustomLayout>
    );
}