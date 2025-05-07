import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/");
    };

    const goToCategories = () => {
        navigate("/admin/categories");
    };

    const goToEpisodes = () => {
        navigate("/admin/episodes");
    }

    const gotoVideo = ()=>{
        navigate("/admin/videos");
    }
    return (
        <div>
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: "#1e1e1e", py: 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Trang Quản Trị
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={goToCategories}
                            sx={{ fontSize: 12 }}
                        >
                            Quản lý Danh mục
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={gotoVideo}
                            sx={{ fontSize: 12 }}
                        >
                            Quản lý Phim
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={goToEpisodes}
                            sx={{ fontSize: 12 }}
                        >
                            Quản lý Tập
                        </Button>
                        <Typography variant="body1" sx={{ fontSize: 14 }}>
                            Xin chào, <strong>{username}</strong>
                        </Typography>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleLogout}
                            sx={{
                                fontWeight: "bold",
                                borderColor: "white",
                                color: "white",
                                fontSize: 12,
                                padding: "6px 12px"
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};
