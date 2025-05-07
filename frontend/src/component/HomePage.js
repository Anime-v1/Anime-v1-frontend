import React, { useEffect, useState } from 'react';
import { getAllCategories } from "../service/CategoriesService";
import { getAllVideos } from "../service/VideoService";
import {
    Box,
    Paper,
    Typography,
    Card,
    CardMedia,
    CardContent,
    AppBar,
    Toolbar,
    Button,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Không thể tải categories:', error);
            }
        };

        const fetchVideos = async () => {
            try {
                const data = await getAllVideos();
                setVideos(data);
            } catch (error) {
                console.error('Không thể tải videos:', error);
            }
        };

        fetchCategories();
        fetchVideos();
    }, []);

    const allCategory = { id: null, name: 'Tất cả' };
    const categoriesWithAll = [allCategory, ...categories];

    const filteredVideos = selectedCategoryId
        ? videos.filter(video =>
            video.categories?.some(cat => cat.id === selectedCategoryId)
        )
        : videos;

    return (
        <Box sx={{
            backgroundColor: 'black',
            minHeight: '100vh',
            color: 'white'
        }}>
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Video Streaming
                    </Typography>
                    <Button color="inherit">Đăng nhập</Button>
                </Toolbar>
            </AppBar>

            {/* Nội dung chính */}
            <Box sx={{
                padding: { xs: 1, sm: 2, md: 3 },
                maxWidth: '1800px',
                margin: '0 auto'
            }}>
                {/* Phần categories */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    mb: 4,
                    py: 1,
                    '&::-webkit-scrollbar': {
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[700],
                        borderRadius: '3px',
                    }
                }}>
                    {categoriesWithAll.map((category) => (
                        <Paper
                            key={category.id || 'all'}
                            onClick={() => setSelectedCategoryId(category.id)}
                            sx={{
                                padding: { xs: 1, sm: 2 },
                                minWidth: 100,
                                flexShrink: 0,
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: selectedCategoryId === category.id
                                    ? theme.palette.primary.main
                                    : theme.palette.grey[800],
                                color: selectedCategoryId === category.id
                                    ? theme.palette.common.white
                                    : theme.palette.grey[300],
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4
                                }
                            }}
                            elevation={selectedCategoryId === category.id ? 4 : 2}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {category.name}
                            </Typography>
                        </Paper>
                    ))}
                </Box>

                {/* Phần videos */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fill, minmax(${isSmallScreen ? '100%' : '240px'}, 1fr))`,
                        gap: 3,
                        justifyContent: 'center'
                    }}
                >
                    {filteredVideos.map((video) => (
                        <Card
                            key={video.id}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                backgroundColor: theme.palette.grey[900],
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    height: { xs: 200, sm: 250, md: 300 },
                                    objectFit: 'cover'
                                }}
                                image={video.image}
                                alt={video.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        minHeight: '64px',
                                        color: 'white'
                                    }}
                                >
                                    {video.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Hiển thị khi không có video */}
                {filteredVideos.length === 0 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px',
                        mt: 4
                    }}>
                        <Typography variant="h6" color="textSecondary">
                            Không có video nào trong danh mục này
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default HomePage;