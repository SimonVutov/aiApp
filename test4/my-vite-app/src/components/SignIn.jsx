import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Link as MuiLink,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';

function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement sign in logic
        console.log('Sign in:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                mt: 8,
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        width: '100%',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ mb: 3 }}
                    >
                        Welcome back
                    </Typography>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Google />}
                        sx={{
                            mb: 3,
                            height: 48,
                            borderColor: 'divider',
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        Continue with Google
                    </Button>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        my: 3
                    }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ px: 2 }}
                        >
                            or continue with email
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 2,
                                mb: 3,
                                height: 48,
                                borderRadius: 2,
                            }}
                        >
                            Sign In
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/signup"
                                    sx={{
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        }
                                    }}
                                >
                                    Sign up for free
                                </MuiLink>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default SignIn; 