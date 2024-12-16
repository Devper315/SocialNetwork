import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Chip, Button, Box, Tooltip } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGroupById } from '../../services/groupService';
import ZoomImage from '../common/ZoomImage';

const GroupDetail = () => {
    const { id } = useParams();
    const [zoom, setZoom] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState('')
    const [group, setGroup] = useState({})

    useEffect(() => {
        fetchGroupById(id).then(result => setGroup(result))
    }, [])

    const handleZoom = (url) => {
        setSelectedUrl(url);
        setZoom(true)
    }

    const handleCloseZoom = () => {
        setZoom(false)
        setSelectedUrl(null)
    }

    return (
        <Box sx={{
            width: "70%", border: "1px solid gray", marginY: 2, ml: "17%",
            textAlign: "left", p: 2, borderRadius: 5
        }}>
            <Avatar src={group.imageUrl} alt="Ảnh nhóm" 
            sx={{ width: 100, height: 100, cursor: "pointer", mb: 2 }}
                onClick={() => handleZoom(group.imageUrl)} />
            <ZoomImage open={zoom} onClose={handleCloseZoom} imageSrc={selectedUrl} />

            <Typography variant="h5" fontWeight={"700"} sx={{ color: 'info' }}>
                {group.name}
            </Typography>
            <Typography variant='body1' maxWidth={"90%"}>Mô tả nhóm này rất rất dài</Typography>
            <Typography>Phần tử 2</Typography>
        </Box>

    );
};

export default GroupDetail;