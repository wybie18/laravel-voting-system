import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintComponent = ({ children }) => {
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
        removeAfterPrint: true,
    });
    return (<>
        <button type="button" onClick={handlePrint} className="bg-green-900 py-1 px-3 text-white rounded shadow transition-all hover:bg-green-700 mb-4 float-end">
            <i className="fa-solid fa-print inline"></i><span className='ml-2'>Print</span>
        </button>
        <div className="w-full h-full" ref={contentToPrint}>
            <div className="print-header text-center">
                <img className="mx-auto w-32 object-cover" src="/logo.png" alt="logo" />
                <img className="mx-auto w-72 object-cover" src="/xavier_name.png" alt="logo" />
            </div>
            <div>
                {children}
            </div>
        </div>

    </>
    )
}

export default PrintComponent