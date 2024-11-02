import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGroup } from "../../services/groupService";


const Group = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [groups, setGroups] = useState([])
    const [keyword, setKeyword] = useState(location.state?.keyword || '')
    // const searchGroup = async () => {
    //     const groupData = fetchGroup(keyword, page)
    // }

    return(
        <div>Danh sách nhóm</div>
    )
}

export default Group