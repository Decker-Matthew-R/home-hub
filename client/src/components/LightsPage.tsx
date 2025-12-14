import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchLights } from '../services/hueApi';
import { LightTile } from './LightTile';

export function LightsPage() {
    const { data: lights, isLoading, error } = useQuery({
        queryKey: ['lights'],
        queryFn: fetchLights,
        refetchInterval: 5000,
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Failed to load lights. Make sure the server is running.
            </Alert>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Lights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Click any light to toggle it on or off
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={3}>
                {lights && Object.entries(lights).map(([id, light]) => (
                    <Box
                        key={id}
                        sx={{
                            width: {
                                xs: '100%',
                                sm: 'calc(50% - 12px)',
                                md: 'calc(33.33% - 16px)',
                                lg: 'calc(25% - 18px)'
                            }
                        }}
                    >
                        <LightTile
                            id={id}
                            name={light.name}
                            isOn={light.state.on}
                            brightness={light.state.bri}
                            hue={light.state.hue}
                            sat={light.state.sat}
                            reachable={light.state.reachable}
                        />
                    </Box>
                ))}
            </Box>
        </Container>
    );
}