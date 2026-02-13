import React, { useContext, useState } from 'react';
import { Box } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import ZoomImage from './ZoomImage';

const ImageGallery = ({ msg }) => {
    const { user } = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleOpen = (url) => {
        setSelectedImage(url);
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedImage(null)
    }

    return (
        <Box sx={{ display: 'block' }}>
            {msg.imageUrls.map((url, index) => (
                <Box key={index} component="img" src={url} alt="Responsive Image"
                    onClick={() => handleOpen(url)}
                    sx={{
                        display: 'block', width: "150px", height: 'auto', marginBottom: 2, 
                        marginLeft: msg.sender === user.username ? 'auto' : 0,
                        cursor: 'pointer', transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }} />
            ))}
            <ZoomImage open={open} onClose={handleClose} imageSrc={selectedImage}/>
        </Box>
    );
}

export default ImageGallery;
