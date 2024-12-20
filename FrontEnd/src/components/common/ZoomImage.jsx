import { Box, CardMedia, Dialog } from "@mui/material";
import React from "react";

const ZoomImage = ({ open, onClose, imageSrc }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" sx={{overflow: "hidden"}}>
            <CardMedia component="img" src={imageSrc}
                sx={{
                    width: "auto", height: '550px',
                }} />
        </Dialog>
    )
}

export default ZoomImage;