import React, { useEffect, useState } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { fetchEmoji } from "../../services/conversationService";
import { handleScroll } from "../../services/infiniteScroll";
import UploadedImage from "./UploadedImage";

const TextInput = ({ handleSubmit, type }) => {
    const [text, setText] = useState('')
    const [commentImage, setCommentImage] = useState(null);
    const [messageImages, setMessageImages] = useState([])
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojis, setEmojis] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [lastId, setLastId] = useState(0)

    const loadMoreEmojis = async () => {
        if (!hasMore) return
        const data = await fetchEmoji(lastId);
        setHasMore(data.length === 50)
        setEmojis([...emojis, ...data]);
        if (data.length === 50)
            setLastId(data.at(-1).id)
    }

    useEffect(() => {
        loadMoreEmojis()
    }, [])

    const handleEmojiClick = (emoji) => {
        setText(text + emoji.content);
    }

    const handleMessageImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setMessageImages([...messageImages, ...files]);
    }

    const handleCommentImageUpload = (event) => {
        const file = event.target.files[0]
        setCommentImage(file)
    }

    const handleRemoveMessageImage = (index) => {
        setMessageImages(messageImages.filter((_, i) => i !== index));
    }

    const onSubmit = () => {
        setShowEmojiPicker(false)
        handleSubmit(text, messageImages)
        setText('')
        setMessageImages([])
        setCommentImage(null)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {(messageImages.length > 0 || commentImage) &&
                <Box sx={{
                    display: "flex", alignItems: "center",
                    width: "auto", gap: 1, padding: "5px", border: "1px solid #ddd",
                    borderRadius: "8px", backgroundColor: "rgba(0,0,0,0)", marginLeft: "5px"
                }}>
                    {type === "message" && messageImages.length > 0 && 
                        messageImages.map((image, index) =>
                        <UploadedImage key={index} image={image} 
                            handleDelete={() => handleRemoveMessageImage(index)}/>)}
                    {type === "comment" && commentImage && 
                        <UploadedImage image={commentImage} 
                        handleDelete={() => setCommentImage(null)}/>}
                </Box>
            }

            {showEmojiPicker && (
                <Box onScroll={(event) => handleScroll(event, loadMoreEmojis)}
                    sx={{
                        position: "relative", display: "grid", padding: 1, border: "1px solid #ddd",
                        gridTemplateColumns: "repeat(8, 40px)", gridTemplateRows: "repeat(4, 40px)",
                        width: "auto", height: "150px", overflow: "auto",
                    }}>
                    {emojis.map(
                        (emoji) => (
                            <IconButton key={emoji.id} onClick={() => handleEmojiClick(emoji)}
                                sx={{ color: "#fff", "&:hover": { backgroundColor: "#f0f0f0" } }}>
                                {emoji.content}
                            </IconButton>)
                    )}
                </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                    component="label"
                    sx={{
                        color: "#1976d2",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                    }}>
                    <ImageIcon />
                    {type === "message" &&
                        <input type="file" accept="image/*" multiple hidden onChange={handleMessageImageUpload} />}
                    {type === "comment" &&
                        <input type="file" accept="image/*" hidden onChange={handleCommentImageUpload} />}
                </IconButton>
                <Box sx={{ position: "relative", flexGrow: 1 }}>
                    <TextField value={text} onChange={(e) => setText(e.target.value)} rows={1}
                        onKeyDown={handleKeyDown} placeholder="Aa" fullWidth multiline variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 5,
                                fontSize: 13,
                            }
                        }} />
                    <IconButton
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        sx={{
                            position: "absolute", right: "8px", top: "50%",
                            transform: "translateY(-50%)", color: "#1976d2",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                        }}>
                        <EmojiEmotionsIcon />
                    </IconButton>
                </Box>

                {/* Send Button */}
                <IconButton
                    onClick={onSubmit}
                    sx={{
                        color: "#1976d2",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                    }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default TextInput;
