import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGroups, fetchMyGroups } from "../../services/groupService";
import { handleScroll } from "../../services/infiniteScroll";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import GroupCreateModal from "./GroupCreateModal";

const GroupList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState(location.state?.keyword || "");
  const [searchInput, setSearchInput] = useState("");
  const [groups, setGroups] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [my, setMy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadMoreGroups();
  }, [keyword, my]);

  const loadMoreGroups = async () => {
    if (!hasMore) return;
    let data;
    if (my) {
      data = await fetchMyGroups(page, keyword);
    } else {
      data = await fetchGroups(page, keyword);
    }


    if (data.length === 0) {
      setHasMore(false);
      return;
    }


    setHasMore(data.length === 10);
    setGroups((prevGroups) => [...prevGroups, ...data]);
    setPage((prevPage) => prevPage + 1);
  };

  const switchToFindAll = () => {
    if (!my) return;
    setMy(false);
    startOver();
  };

  const switchToFindMine = () => {
    if (my) return;
    setMy(true);
    startOver();
  };

  const handleSearch = () => {
    startOver();
    setKeyword(searchInput);
  };

  const startOver = () => {
    setPage(1);
    setGroups([]);
    setHasMore(true);
  };

  const showCreateModal = () => {
    setShowCreate(true);
  };

  const closeCreateModal = () => {
    setShowCreate(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Danh sách nhóm
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={showCreateModal}>
          Tạo nhóm
        </Button>
        <Button variant={my ? "outlined" : "contained"} onClick={switchToFindAll}>
          Tìm nhóm
        </Button>
        <Button variant={!my ? "outlined" : "contained"} onClick={switchToFindMine}>
          Nhóm của tôi
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Nhập từ khóa tìm kiếm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Tìm
        </Button>
      </Box>
      <Box
        sx={{
          maxHeight: "500px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
        }}
        onScroll={(event) => handleScroll(event, loadMoreGroups)}
      >
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" },
                }}
                onClick={() => navigate(`/group-detail/${group.id}`)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={group.imageUrl || "https://via.placeholder.com/150"}
                  alt="Ảnh nhóm"
                />
                <CardContent>
                  <Typography variant="subtitle1" noWrap>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {group.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {!hasMore && groups.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
            Không tìm thấy nhóm nào.
          </Typography>
        )}
        {hasMore && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
      <GroupCreateModal show={showCreate} handleClose={closeCreateModal} />
    </Box>
  );
};

export default GroupList;
