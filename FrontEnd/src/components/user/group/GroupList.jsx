import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGroups, fetchMyGroups } from "../../../services/groupService";
import { handleScroll } from "../../../services/infiniteScroll";
import '../../../assets/styles/user/GroupList.css'
import GroupCreateModal from "./GroupCreateModal";

const GroupList = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [keyword, setKeyword] = useState(location.state?.keyword || '')
    const [searchInput, setSearchInput] = useState('')
    const [groups, setGroups] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1);
    const [my, setMy] = useState(false)
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        loadMoreGroups()
    }, [keyword, my]);

    const loadMoreGroups = async () => {
        if (!hasMore) return
        let data
        if (my) {
            data = await fetchMyGroups(page, keyword);
        }
        else data = await fetchGroups(page, keyword)
        setHasMore(data.length === 10)
        setGroups([...groups, ...data]);
        setPage(page + 1)
    };

    const switchToFindAll = () => {
        if (!my) return
        setMy(false)
        startOver()
    }

    const switchToFindMine = () => {
        if (my) return
        setMy(true)
        startOver()
    }

    const handleSearch = () => {
        startOver()
        setKeyword(searchInput)
    }

    const startOver = () => {
        setPage(1)
        setGroups([])
        setHasMore(true)
    }

    const showCreateModal = () => {
        setShowCreate(true)
    }

    const closeCreateModal = () => {
        setShowCreate(false)
    }

    return (
        <div>
            <h6>Danh sách nhóm</h6>
            <div>
                <button onClick={showCreateModal}>Tạo nhóm</button>
                <button onClick={switchToFindAll}>Tìm nhóm</button>
                <button onClick={switchToFindMine}>Nhóm của tôi</button>
            </div>
            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm" />
            <button onClick={handleSearch}>Tìm</button>
            <div className="group-container"
                onScroll={(event) => handleScroll(event, loadMoreGroups)}>
                {groups.map(group => (
                    <div key={group.id}>
                        <img alt="Ảnh nhóm" style={{ width: 100 }} />
                        <div onClick={() => navigate(`/group-detail/${group.id}`)}>
                            {group.id + " " + group.name}
                        </div>
                    </div>
                ))}
            </div>
            <GroupCreateModal show={showCreate} handleClose={closeCreateModal} />

        </div>
    )
}

export default GroupList