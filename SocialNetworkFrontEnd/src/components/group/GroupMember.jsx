import React, { useContext, useEffect, useState } from "react";

import { Avatar, Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

import { changeGroupOwner, changeMemberRole, fetchGroupMembers, removeGroupMember } from "../../services/groupService";
import GroupMemberDetail from "./GroupMemberDetail";


const GroupMember = ({ group, setGroup, userGroupContext, setUserGroupContext }) => {
    const [members, setMembers] = useState([])

    useEffect(() => {
        const getMembers = async () => {
            const memberData = await fetchGroupMembers(group.id)
            setMembers(memberData)
        }
        getMembers()
    }, [])

    const updateMember = (member, action) => {
        if (action === "transfer"){
            changeGroupOwner(group.id, member.id)
            setMembers(members.map(m => {
                if (m.groupRole === "OWNER") return {...m, groupRole: "MEMBER"}
                else if (m.id === member.id) return {...m, groupRole: "OWNER"}
                else return m
            }))
            setUserGroupContext({...userGroupContext, owner: false, member: true})
        }
        else if (action === "assign"){
            changeMemberRole(group.id, member.id, "APPROVER")
            setMembers(members.map(m => m.id === member.id ? {...m, groupRole: "APPROVER"} : m))
        }
        else if (action === "revoke"){
            changeMemberRole(group.id, member.id, "MEMBER")
            setMembers(members.map(m => m.id === member.id ? {...m, groupRole: "MEMBER"} : m))
        }
        else if (action === "remove"){
            removeGroupMember(group.id, member.id)
            setMembers(members.filter(m => m.id !== member.id))
            setGroup({...group, totalMember: group.totalMember - 1})
        }
    }


    return (
        <Box textAlign="left" height="500px">
            <Typography fontWeight="bold" sx={{ mb: 1 }}>Danh sách thành viên</Typography>
            {members.map(member =>
                <GroupMemberDetail member={member} updateMember={updateMember}
                    userGroupContext={userGroupContext} />
            )}
        </Box>
    )
}

export default GroupMember