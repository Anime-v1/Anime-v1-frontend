import React, { useEffect, useState } from "react";
import {
    Container, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
    Tooltip, CircularProgress, Alert, Chip
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { toast } from "react-toastify";
import {
    getEpisodesById,
    createEpisode,
    updateEpisode,
    deleteEpisode
} from "../service/EpisodeService";
import { getVideoById, getAllVideos } from "../service/VideoService";
import { AdminPage } from "./AdminPage";

export const AdminEpisodes = () => {
    const [episodes, setEpisodes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        numEpisode: "",
        linkEpisode: "",
        episodeType: "link" // 'link' or 'embed'
    });
    const [errors, setErrors] = useState({});
    const [editingEpisode, setEditingEpisode] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [episodeToDelete, setEpisodeToDelete] = useState(null);
    const [loading, setLoading] = useState({
        videos: false,
        episodes: false,
        submitting: false
    });

    const extractVideoId = (url) => {
        // For YouTube embed links
        const embedMatch = url.match(/embed\/([^?]+)/);
        if (embedMatch) return embedMatch[1];

        // For standard YouTube URLs
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const isYoutubeLink = (url) => {
        return url.includes('youtube.com') || url.includes('youtu.be');
    };

    const getThumbnailUrl = (url) => {
        const videoId = extractVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    };

    const fetchVideos = async () => {
        try {
            setLoading(prev => ({...prev, videos: true}));
            const data = await getAllVideos();
            setVideos(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách video:", error);
            toast.error("Lỗi khi tải danh sách phim");
        } finally {
            setLoading(prev => ({...prev, videos: false}));
        }
    };

    const fetchEpisodes = async (id) => {
        try {
            setLoading(prev => ({...prev, episodes: true}));
            const data = await getEpisodesById(id);
            setEpisodes(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tập:", error);
            toast.error("Lỗi khi tải danh sách tập phim");
        } finally {
            setLoading(prev => ({...prev, episodes: false}));
        }
    };

    const fetchVideoTitle = async (id) => {
        try {
            const video = await getVideoById(id);
            if (video?.title || video?.name) {
                setVideoTitle(video.title || video.name);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin video:", error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        if (selectedVideoId) {
            fetchEpisodes(selectedVideoId);
            fetchVideoTitle(selectedVideoId);
        } else {
            setEpisodes([]);
            setVideoTitle("");
        }
    }, [selectedVideoId]);

    const handleOpenDialog = (episode = null) => {
        setEditingEpisode(episode);
        setFormData(episode ? {
            numEpisode: episode.numEpisode.toString(),
            linkEpisode: episode.linkEpisode,
            episodeType: episode.linkEpisode.includes('<iframe') ? 'embed' : 'link'
        } : {
            numEpisode: "",
            linkEpisode: "",
            episodeType: "link"
        });
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingEpisode(null);
        setFormData({ numEpisode: "", linkEpisode: "", episodeType: "link" });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.numEpisode.trim()) {
            newErrors.numEpisode = "Vui lòng nhập số tập";
        } else if (isNaN(formData.numEpisode)) {
            newErrors.numEpisode = "Số tập phải là số";
        }

        if (!formData.linkEpisode.trim()) {
            newErrors.linkEpisode = "Vui lòng nhập link tập phim";
        } else if (formData.episodeType === 'link' && !isValidUrl(formData.linkEpisode)) {
            newErrors.linkEpisode = "Link không hợp lệ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(prev => ({...prev, submitting: true}));

        const payload = {
            numEpisode: parseInt(formData.numEpisode),
            linkEpisode: formData.linkEpisode,
            video: { id: selectedVideoId }
        };

        try {
            if (editingEpisode) {
                await updateEpisode(editingEpisode.id, payload);
                toast.success("Cập nhật tập thành công");
            } else {
                await createEpisode(payload);
                toast.success("Thêm tập mới thành công");
            }
            fetchEpisodes(selectedVideoId);
            handleCloseDialog();
        } catch (error) {
            console.error("Lỗi khi lưu tập:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(prev => ({...prev, submitting: false}));
        }
    };

    const confirmDelete = (ep) => {
        setEpisodeToDelete(ep);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(prev => ({...prev, submitting: true}));
            await deleteEpisode(episodeToDelete.id);
            toast.success("Xóa tập thành công");
            fetchEpisodes(selectedVideoId);
        } catch (error) {
            toast.error("Lỗi khi xóa tập");
        } finally {
            setLoading(prev => ({...prev, submitting: false}));
            setDeleteDialogOpen(false);
            setEpisodeToDelete(null);
        }
    };

    const renderLinkCell = (link) => {
        if (link.includes('<iframe')) {
            const videoId = extractVideoId(link);
            if (videoId) {
                return (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
                        startIcon={<PlayCircleOutlineIcon />}
                    >
                        Xem trên YouTube
                    </Button>
                );
            }
            return <Chip label="Embed" color="primary" />;
        }

        const thumbnailUrl = getThumbnailUrl(link);

        return (
            <Box display="flex" alignItems="center" gap={1}>
                {thumbnailUrl && (
                    <img
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        style={{ width: 120, borderRadius: 4 }}
                    />
                )}
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(link, '_blank')}
                >
                    {isYoutubeLink(link) ? 'Xem trên YouTube' : 'Mở liên kết'}
                </Button>
            </Box>
        );
    };

    return (
        <>
            <AdminPage />
            <Container sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6">Chọn phim:</Typography>
                        {loading.videos ? (
                            <CircularProgress size={24} />
                        ) : (
                            <TextField
                                select
                                size="small"
                                value={selectedVideoId}
                                onChange={(e) => setSelectedVideoId(e.target.value)}
                                SelectProps={{ native: true }}
                                sx={{ minWidth: 200 }}
                            >
                                <option value="">-- Chọn phim --</option>
                                {videos.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.title || v.name}
                                    </option>
                                ))}
                            </TextField>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => handleOpenDialog()}
                        disabled={!selectedVideoId || loading.episodes}
                        startIcon={loading.episodes ? <CircularProgress size={16} /> : null}
                    >
                        {loading.episodes ? 'Đang tải...' : 'Thêm tập'}
                    </Button>
                </Box>

                {selectedVideoId && (
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {videoTitle && `Danh sách Tập Phim - ${videoTitle}`}
                    </Typography>
                )}

                {loading.episodes ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="100px"><strong>Tập số</strong></TableCell>
                                <TableCell><strong>Nội dung</strong></TableCell>
                                <TableCell width="150px"><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {episodes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        {selectedVideoId ? "Chưa có tập phim nào" : "Vui lòng chọn phim để xem danh sách tập"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                episodes.map((ep) => (
                                    <TableRow key={ep.id} hover>
                                        <TableCell>
                                            <Typography fontWeight="bold">Tập {ep.numEpisode}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {renderLinkCell(ep.linkEpisode)}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Sửa">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(ep)}
                                                    disabled={loading.submitting}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    onClick={() => confirmDelete(ep)}
                                                    disabled={loading.submitting}
                                                >
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingEpisode ? "Sửa tập phim" : "Thêm tập phim"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tập số *"
                            name="numEpisode"
                            type="number"
                            fullWidth
                            value={formData.numEpisode}
                            onChange={handleChange}
                            error={!!errors.numEpisode}
                            helperText={errors.numEpisode}
                            sx={{ mt: 2 }}
                            disabled={loading.submitting}
                        />

                        <Box mt={2}>
                            <Typography variant="subtitle2" gutterBottom>
                                Loại liên kết *
                            </Typography>
                            <Box display="flex" gap={2} mb={2}>
                                <Button
                                    variant={formData.episodeType === 'link' ? 'contained' : 'outlined'}
                                    onClick={() => setFormData(prev => ({...prev, episodeType: 'link'}))}
                                >
                                    Link URL
                                </Button>
                                <Button
                                    variant={formData.episodeType === 'embed' ? 'contained' : 'outlined'}
                                    onClick={() => setFormData(prev => ({...prev, episodeType: 'embed'}))}
                                >
                                    Mã nhúng (Embed)
                                </Button>
                            </Box>

                            <TextField
                                label={formData.episodeType === 'link' ? "Link tập phim *" : "Mã nhúng iframe *"}
                                name="linkEpisode"
                                fullWidth
                                value={formData.linkEpisode}
                                onChange={handleChange}
                                error={!!errors.linkEpisode}
                                helperText={errors.linkEpisode || (
                                    formData.episodeType === 'link' ?
                                        "Ví dụ: https://youtube.com/watch?v=abc123" :
                                        "Dán mã iframe từ YouTube hoặc nền tảng khác"
                                )}
                                multiline={formData.episodeType === 'embed'}
                                rows={formData.episodeType === 'embed' ? 4 : 1}
                                disabled={loading.submitting}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={loading.submitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading.submitting}
                            startIcon={loading.submitting ? <CircularProgress size={16} /> : null}
                        >
                            {loading.submitting ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => !loading.submitting && setDeleteDialogOpen(false)}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc chắn muốn xóa tập số {episodeToDelete?.numEpisode}?
                        </Typography>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Hành động này không thể hoàn tác!
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={loading.submitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            variant="contained"
                            color="error"
                            disabled={loading.submitting}
                            startIcon={loading.submitting ? <CircularProgress size={16} /> : null}
                        >
                            {loading.submitting ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};