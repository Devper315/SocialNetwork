import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Typography, Pagination, InputAdornment } from '@mui/material';
import { searchFriend } from '../../services/friendService';
import SearchIcon from '@mui/icons-material/Search';
import Friend from './Friend';

const SearchTab = () => {
    const [keyword, setKeyword] = useState('')
    const [page, setPage] = useState(0)
    const [resetPage, setResetPage] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [searchResults, setSearchResults] = useState([])
    const inputRef = useRef(null)

    const fetchData = async () => {
        if (keyword.trim()) {
            let pageSearch = page
            if (resetPage) {
                pageSearch = 1
                setPage(1)
                setResetPage(false)
            }
            const data = await searchFriend(keyword, pageSearch, 5)
            setSearchResults(data.result)
            setTotalPages(data.totalPages)

        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

    useEffect(() => {
        if (!resetPage) setResetPage(true)
    }, [keyword])

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchData();
        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginBottom: 2,
            }}>
                <TextField
                    fullWidth inputRef={inputRef}
                    placeholder="Nhập tên bạn..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    variant="outlined"
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
                    sx={{ height: '54px' }}>
                    Tìm
                </Button>
            </Box>
            {searchResults.length > 0 &&
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                    gap={3}>
                    {searchResults.map(friend => (
                        <Friend user={friend} />
                    ))}
                </Box>}
            {searchResults.length === 0 && <Typography>Không có kết quả tìm kiếm.</Typography>}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                    />
                </Box>
            )}
        </>

    );
};

export default SearchTab;
