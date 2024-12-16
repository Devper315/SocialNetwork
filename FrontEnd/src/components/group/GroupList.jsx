import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGroups } from "../../services/groupService";
import { Box, Button, Typography, TextField, Grid, Card, CardMedia, CardContent, InputAdornment, Pagination } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupCreateModal from "./GroupCreateModal";

const GroupList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [keyword, setKeyword] = useState(location.state?.keyword || "");
    const [groups, setGroups] = useState([]);
    const [page, setPage] = useState(location.state?.page || 1)
    const [resetPage, setResetPage] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [showCreate, setShowCreate] = useState(false);

    const fetchData = async () => {
        let pageSearch = page
        if (resetPage) {
            pageSearch = 1
            setPage(1)
            setResetPage(false)
        }
        const data = await fetchGroups(keyword, pageSearch, 6)
        console.log(data.result)
        setGroups(data.result)
        setTotalPages(data.totalPages)
    }

    useEffect(() => {
        if (keyword !== "") fetchData()
    }, [])

    useEffect(() => {
        if (!resetPage) setResetPage(true)
    }, [keyword])

    useEffect(() => {
        fetchData()
        console.log(keyword, resetPage)
    }, [page])


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchData();
        }
    }


    return (
        <Box sx={{ marginY: 2, width: "70%", position: "relative", left: "25%", textAlign: "left" }}>
            <Button variant="contained" onClick={() => setShowCreate(true)}
                sx={{ borderRadius: 2 }}>
                <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                Tạo nhóm mới
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginY: 2, width: "60%" }}>
                <TextField fullWidth placeholder="Nhập từ khóa..." value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} variant="outlined"
                    onKeyDown={handleKeyDown}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 5, fontSize: "14px"
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    onClick={fetchData}
                    sx={{ height: '50px', borderRadius: 2 }}>
                    Tìm
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', marginLeft: "auto" }}>
                Danh sách nhóm
            </Typography>

            <Box
                sx={{
                    maxHeight: "600px",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    backgroundColor: "#f9f9f9",
                    overflow: "auto",
                }}
            >
                <Grid container spacing={3}>
                    {groups.map((group) => (
                        <Grid item xs={12} sm={6} md={4} key={group.id}>
                            <Card
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    "&:hover": {
                                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                                        transform: "translateY(-5px)",
                                        backgroundColor: "#f4f4f4",
                                    },
                                }}
                                onClick={() => navigate(`/group-detail/${group.id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={group.imageUrl || "https://via.placeholder.com/150"}
                                    alt="Ảnh nhóm"
                                    sx={{
                                        borderTopLeftRadius: 3,
                                        borderTopRightRadius: 3,
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        textAlign: "center",
                                        p: 2,
                                    }}>
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontWeight: "bold",
                                            color: "#333",
                                        }}
                                    >
                                        {group.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, newPage) => setPage(newPage)}
                            color="primary" />
                    </Box>
                )}
            </Box>


            <GroupCreateModal show={showCreate} handleClose={() => setShowCreate(false)} />
        </Box>

    );
};

export default GroupList;
