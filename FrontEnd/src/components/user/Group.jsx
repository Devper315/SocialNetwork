import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGroup } from "../../services/groupService";
import useInfiniteScroll from "../../hook/useInfiniteScroll";


const Group = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [keyword, setKeyword] = useState(location.state?.keyword || '')
    const containerRef = useRef(null)
    const {items: groups, hasMore} = useInfiniteScroll([], keyword, fetchGroup, containerRef)
    return(
        <div ref={containerRef}>
            <h6>Danh sách nhóm</h6>
            {groups.map(group => (
                <div key={group.id}>{group.name}</div>   
            ))}
            {hasMore && <p>Loading more...</p>}
        </div>
    )
}

export default Group