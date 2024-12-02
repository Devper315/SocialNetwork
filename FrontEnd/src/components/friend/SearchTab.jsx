import React from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const SearchTab = ({ keyword, setKeyword, searchResults, handleSearch }) => {
    return (
        <Box>
            <TextField
                fullWidth
                placeholder="Nhập tên bạn..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                variant="outlined"
            />
            <Button variant="contained" onClick={handleSearch}>
                Tìm
            </Button>
            <Divider sx={{ margin: 2 }} />
            <List>
                {searchResults.map((result) => (
                    <ListItem key={result.id}>
                        <ListItemText primary={result.fullName} />
                        <Link to={`/profile/${result.id}`}>Xem hồ sơ</Link>
                    </ListItem>
                ))}
                {searchResults.length === 0 && <Typography>Không có kết quả tìm kiếm.</Typography>}
            </List>
        </Box>
    );
};

export default SearchTab;
