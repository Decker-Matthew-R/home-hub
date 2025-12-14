import { Card, CardContent, Typography, IconButton, Box, Slider, Button } from '@mui/material';
import { Lightbulb, LightbulbOutlined, Palette } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLight, setBrightness, setColor } from '../services/hueApi';
import { useState, useMemo } from 'react';
import { ColorPickerModal } from './ColorPickerModal';
import { throttle } from 'lodash';

interface LightTileProps {
    id: string;
    name: string;
    isOn: boolean;
    brightness: number;
    hue: number;
    sat: number;
    reachable: boolean;
}

export function LightTile({ id, name, isOn, brightness, hue, sat, reachable }: LightTileProps) {
    const queryClient = useQueryClient();

    const normalizedBrightness = Math.round((brightness / 254) * 100);
    const [localBrightness, setLocalBrightness] = useState(normalizedBrightness);
    const [colorModalOpen, setColorModalOpen] = useState(false);

    const toggleMutation = useMutation({
        mutationFn: (newState: boolean) => toggleLight(id, newState),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lights'] });
        },
    });

    const brightnessMutation = useMutation({
        mutationFn: (brightness: number) => setBrightness(id, brightness / 100),
    });

    const colorMutation = useMutation({
        mutationFn: ({ hue, sat }: { hue: number; sat: number }) => setColor(id, hue, sat),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lights'] });
        },
    });

    // Throttle brightness changes to every 200ms while sliding
    const throttledBrightnessChange = useMemo(
        () => throttle((value: number) => {
            brightnessMutation.mutate(value);
        }, 200),
        [id]
    );

    const handleToggle = () => {
        if (reachable) {
            toggleMutation.mutate(!isOn);
        }
    };

    const handleBrightnessChange = (_event: Event, newValue: number | number[]) => {
        const value = Array.isArray(newValue) ? newValue[0] : newValue;
        setLocalBrightness(value);
        // Send throttled API call while dragging
        throttledBrightnessChange(value);
    };

    const handleColorChange = (hue: number, sat: number) => {
        colorMutation.mutate({ hue, sat });
    };

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: reachable ? 1 : 0.5,
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 2,
                            cursor: reachable ? 'pointer' : 'not-allowed',
                        }}
                        onClick={handleToggle}
                    >
                        <IconButton
                            size="large"
                            sx={{
                                color: isOn ? '#FDB813' : 'text.disabled',
                                fontSize: 60,
                                pointerEvents: 'none',
                            }}
                            disabled={!reachable}
                        >
                            {isOn ? <Lightbulb sx={{ fontSize: 60 }} /> : <LightbulbOutlined sx={{ fontSize: 60 }} />}
                        </IconButton>
                    </Box>

                    <Typography variant="h6" component="div" gutterBottom textAlign="center">
                        {name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                        {isOn ? 'On' : 'Off'}
                    </Typography>

                    {isOn && reachable && (
                        <>
                            <Box sx={{ px: 1, mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    Brightness: {localBrightness}%
                                </Typography>
                                <Slider
                                    value={localBrightness}
                                    onChange={handleBrightnessChange}
                                    aria-label="Brightness"
                                    min={1}
                                    max={100}
                                    disabled={!reachable}
                                    sx={{
                                        color: '#FDB813',
                                        '& .MuiSlider-thumb': {
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: '0px 0px 0px 8px rgba(253, 184, 19, 0.16)',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={<Palette />}
                                onClick={() => setColorModalOpen(true)}
                                fullWidth
                                size="small"
                            >
                                Change Color
                            </Button>
                        </>
                    )}

                    {!reachable && (
                        <Typography variant="caption" color="error" display="block" textAlign="center" sx={{ mt: 1 }}>
                            Unreachable
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <ColorPickerModal
                open={colorModalOpen}
                onClose={() => setColorModalOpen(false)}
                lightName={name}
                currentHue={hue}
                currentSat={sat}
                onColorChange={handleColorChange}
            />
        </>
    );
}