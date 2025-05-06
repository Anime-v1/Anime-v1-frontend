import React, { useEffect, useState } from "react";
import {
    Typography,
    Container,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Chip,
} from "@mui/material";

import {
    getAllVideos,
    createVideo,
    updateVideo,
    deleteVideo,
} from "../service/VideoService";
import { getAllCategories } from "../service/CategoriesService";
import { AdminPage } from "./AdminPage";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {toast} from "react-toastify";

export const AdminVideos = () => {
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [detailVideo, setDetailVideo] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        categories: [],
    });

    const fetchVideos = async () => {
        const data = await getAllVideos();
        setVideos(data);
    };

    const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
    };

    const handleOpenDetailDialog = (video) => {
        setDetailVideo(video);
        setDetailDialogOpen(true);
    };

    const handleCloseDetailDialog = () => {
        setDetailDialogOpen(false);
        setDetailVideo(null);
    };

    useEffect(() => {
        fetchVideos();
        fetchCategories();
    }, []);

    const handleOpenDialog = (video = null) => {
        setEditingVideo(video);
        setFormData(
            video
                ? {
                    title: video.title,
                    description: video.description,
                    image: video.image,
                    categories: video.categories || [],
                }
                : {
                    title: "",
                    description: "",
                    image: "",
                    categories: [],
                }
        );
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingVideo(null);
        setFormData({ title: "", description: "", image: "", categories: [] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (event, value) => {
        setFormData({ ...formData, categories: value });
    };

    const handleSubmit = async () => {
        const payload = {
            ...formData,
            categories: formData.categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
            })),
        };

        try {
            if (editingVideo) {
                await updateVideo(editingVideo.id, payload);
            } else {
                await createVideo(payload);
            }
            fetchVideos();
            handleCloseDialog();
            toast.success("Lưu Video Thành Công");
        } catch (error) {
            toast.success("Xóa Video Thành Công");
            console.error("Lỗi khi lưu video:", error);
        }
    };

    const confirmDelete = (video) => {
        setVideoToDelete(video);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteVideo(videoToDelete.id);
            toast.success("Xóa Video Thành Công");
            fetchVideos();
        } catch (err) {
            console.error("Lỗi khi xóa video:", err);
        } finally {
            setDeleteDialogOpen(false);
            setVideoToDelete(null);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "test_cloundinary");
        setIsUploadingImage(true);
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/drszapjl6/image/upload", {
                method: "POST",
                body: uploadData,
            });
            const data = await response.json();
            if (data.secure_url) {
                setFormData((prev) => ({ ...prev, image: data.secure_url }));
            } else {
                alert("Upload ảnh thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
        }
        finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <>
            <AdminPage />
            <Container sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                        Quản lý Video
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Thêm video
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Tiêu đề</strong></TableCell>
                            <TableCell><strong>Danh mục</strong></TableCell>
                            <TableCell><strong>Hình ảnh</strong></TableCell>
                            <TableCell><strong>Hành động</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {videos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Không có video nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            videos.map((video) => (
                                <TableRow key={video.id}>
                                    <TableCell>
                                        <Typography fontWeight="bold">{video.title}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        {(video.categories || []).map((c) => (
                                            <Chip
                                                key={c.id}
                                                label={c.name}
                                                size="small"
                                                sx={{ mr: 0.5, mb: 0.5, backgroundColor: "#e0f2f1", color: "#004d40" }}
                                            />
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {video.image && (
                                            <img
                                                src={video.image}
                                                alt="Thumbnail"
                                                style={{ width: "80px", height: "auto", borderRadius: "6px" }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Sửa">
                                            <IconButton size="small" onClick={() => handleOpenDialog(video)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton size="small" color="info" onClick={() => handleOpenDetailDialog(video)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton size="small" color="error" onClick={() => confirmDelete(video)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        <Typography>Bạn có chắc chắn muốn xóa video này không?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Chi tiết Video</DialogTitle>
                    <DialogContent dividers>
                        {detailVideo ? (
                            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3}>
                                {/* Phần văn bản */}
                                <Box flex={1}>
                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">Tiêu đề</Typography>
                                        <Typography variant="h6">{detailVideo.title}</Typography>
                                    </Box>
                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">Danh mục</Typography>
                                        <Box mt={0.5}>
                                            {(detailVideo.categories || []).map((cat) => (
                                                <Chip
                                                    key={cat.id}
                                                    label={cat.name}
                                                    sx={{
                                                        mr: 0.5,
                                                        mb: 0.5,
                                                        backgroundColor: "#e8f5e9",
                                                        color: "#1b5e20",
                                                        fontSize: "0.875rem"
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Mô tả</Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                                            {detailVideo.description}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Phần hình ảnh */}
                                {detailVideo.image && (
                                    <Box flexShrink={0} display="flex" justifyContent="center" alignItems="center">
                                        <img
                                            src={detailVideo.image}
                                            alt="Thumbnail"
                                            style={{
                                                maxWidth: "250px",
                                                width: "100%",
                                                height: "auto",
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Typography>Không có dữ liệu để hiển thị.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetailDialog} variant="outlined">Đóng</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingVideo ? "Sửa video" : "Thêm video"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tiêu đề"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Mô tả"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mt: 2 }}
                            InputProps={{
                                sx: { lineHeight: 2 } // chỉnh line-height khi gõ
                            }}
                        />
                        <Box mt={2}>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            {isUploadingImage ? (
                                <Typography color="text.secondary" mt={1}>Đang tải ảnh...</Typography>
                            ) : (
                                formData.image && (
                                    <Box mt={1}>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            style={{ width: "100px", borderRadius: "8px" }}
                                        />
                                    </Box>
                                )
                            )}
                        </Box>
                        <Autocomplete
                            multiple
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            value={formData.categories}
                            onChange={handleCategoryChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Danh mục" sx={{ mt: 2 }} />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};
