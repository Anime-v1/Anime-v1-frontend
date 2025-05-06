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
} from "@mui/material";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../service/CategoriesService";
import { AdminPage } from "./AdminPage";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';

export const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deletingCategoryId, setDeletingCategoryId] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "" });

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category = null) => {
        setEditingCategory(category);
        setFormData(category ? { name: category.name } : { name: "" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
        setFormData({ name: "" });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            fetchCategories();
            handleCloseDialog();
            toast.success("Lưu thành công");
        } catch (error) {
            toast.error("Lỗi khi lưu danh mục");
            console.error("Lỗi khi lưu danh mục:", error);
        }
    };

    const confirmDeleteCategory = (id) => {
        setDeletingCategoryId(id);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCategory(deletingCategoryId);
            toast.success("Xóa thành công");
            fetchCategories();
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
            toast.error("Lỗi khi xóa danh mục");
        } finally {
            setOpenConfirmDialog(false);
            setDeletingCategoryId(null);
        }
    };

    return (
        <>
            <AdminPage />
            <Container sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Quản lý Danh mục
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Thêm danh mục
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Tên danh mục</strong></TableCell>
                            <TableCell><strong>Hành động</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Không có danh mục nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Sửa">
                                            <IconButton size="small" onClick={() => handleOpenDialog(cat)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton size="small" color="error" onClick={() => confirmDeleteCategory(cat.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Dialog Thêm/Sửa */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Tên danh mục"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog Xác Nhận Xóa */}
                <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        Bạn có chắc muốn xóa danh mục này không? Hành động này không thể hoàn tác.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
                        <Button onClick={handleConfirmDelete} color="error" variant="contained">
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};
