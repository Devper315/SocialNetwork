import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const UploadedImage = ({image, url, handleDelete}) => {
    const [imagePreview, setImagePreview] = useState('')
    useEffect(() => {
        if (!image) return
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(image)
    }, [image])
    return (
        <div style={{ position: "relative" }}>
            <img src={imagePreview || url} alt="ảnh"
                style={{
                    height: 50, borderRadius: 4, width: '50px', objectFit: "cover"
                }} />
            <Box onClick={handleDelete}
                sx={{
                    position: "absolute", top: "2px", right: "2px", width: "16px",
                    height: "16px", backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", zIndex: 2,
                }}> ✕ </Box>
        </div>
    )
}

export default UploadedImage