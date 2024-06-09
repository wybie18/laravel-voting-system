import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";

export default function ViewPlatformModal({ modalOpen, closeModal, candidate }) {
    return (
        <Modal show={modalOpen} onClose={closeModal}>
            <div className='p-6'>
                <div className="flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl mx-auto">
                    <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={candidate ? candidate.image_url : ""} alt="profile" />
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{candidate ? `${candidate.position.election.name}` : ""}</h5>
                        <h5 className="mb-2 text-sm">{candidate ? ` ${candidate.name} - ${candidate.position.name}` : ""}</h5>
                        <p className="mb-3 font-normal text-gray-700">{candidate ? candidate.platform : ""}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
                </div>
            </div>
        </Modal>
    )
}