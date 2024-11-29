import { Box, Dialog } from "@mui/material";
import React from "react";

const ZoomImage = ({ open, onClose, imageSrc }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <Box component="img" src={imageSrc} alt="Zoom Image"
                sx={{
                    width: '100%', height: 'auto',
                }} />
        </Dialog>
    )
}

export default ZoomImage;