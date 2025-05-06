import React, { useState } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../service/AccountService";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const { role } = await login(username, password);
            if (role === "ROLE_ADMIN") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err) {
            setError(err.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{ px: 2 }}
            >
                <Paper elevation={4} sx={{ p: 5, width: "100%", borderRadius: 3 }}>
                    <Typography
                        variant="h5"
                        align="center"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                    >
                        Đăng nhập hệ thống
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Tên đăng nhập"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 4, py: 1.5, borderRadius: 2 }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
