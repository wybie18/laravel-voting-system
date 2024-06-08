export default function TableHeading({name, sortable=true, sort_field = null, sort_direction = null, sortChange = () => {}, children}){
    return(
        <th onClick={e => sortChange(name)}>
            <div className="px-3 py-2 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                {sortable ? 
                    <div className="flex flex-col gap-2 text-gray-400">
                        <i className={
                            "fa-solid fa-sm fa-chevron-up " + 
                            (sort_field === name && sort_direction === "asc" ? "text-gray-800" : "")
                        }></i>
                        <i className={
                            "fa-solid fa-sm fa-chevron-down " +
                            (sort_field === name && sort_direction === "desc" ? "text-gray-800" : "")
                        }></i>
                    </div> : ""
                }
            </div>
        </th>
    )
}