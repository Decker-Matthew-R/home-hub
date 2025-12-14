import { Card, CardContent, Typography, Box, Slider, Button, Switch, FormControlLabel } from '@mui/material';
import { Palette } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleGroup, setGroupBrightness, setGroupColor } from '../services/groupApi';
import { useState, useMemo } from 'react';
import { throttle } from 'lodash';
import { ColorPickerModal } from './ColorPickerModal';

interface GroupControlProps {
    groupId: string;
    groupName: string;
}

export function GroupControl({ groupId, groupName }: GroupControlProps) {
    const queryClient = useQueryClient();
    const [isOn, setIsOn] = useState(true);
    const [brightness, setBrightness] = useState(100);
    const [colorModalOpen, setColorModalOpen] = useState(false);

    const toggleMutation = useMutation({
        mutationFn: (on: boolean) => toggleGroup(groupId, on),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lights'] });
        },
    });

    const brightnessMutation = useMutation({
        mutationFn: (brightness: number) => setGroupBrightness(groupId, brightness / 100),
    });

    const colorMutation = useMutation({
        mutationFn: ({ hue, sat }: { hue: number; sat: number }) => setGroupColor(groupId, hue, sat),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lights'] });
        },
    });

    const throttledBrightnessChange = useMemo(
        () => throttle((value: number) => {
            brightnessMutation.mutate(value);
        }, 200),
        []
    );

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = event.target.checked;
        setIsOn(newState);
        toggleMutation.mutate(newState);
    };

    const handleBrightnessChange = (_event: Event, newValue: number | number[]) => {
        const value = Array.isArray(newValue) ? newValue[0] : newValue;
        setBrightness(value);
        throttledBrightnessChange(value);
    };

    const handleColorChange = (hue: number, sat: number) => {
        colorMutation.mutate({ hue, sat });
    };

    return (
        <>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" component="h2">
                            {groupName}
                        </Typography>
                        <FormControlLabel
                            control={<Switch checked={isOn} onChange={handleToggle} />}
                            label={isOn ? 'On' : 'Off'}
                        />
                    </Box>

                    {isOn && (
                        <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Brightness: {brightness}%
                            </Typography>
                            <Slider
                                value={brightness}
                                onChange={handleBrightnessChange}
                                aria-label="Group Brightness"
                                min={1}
                                max={100}
                                sx={{
                                    color: '#FDB813',
                                    mb: 2,
                                    '& .MuiSlider-thumb': {
                                        '&:hover, &.Mui-focusVisible': {
                                            boxShadow: '0px 0px 0px 8px rgba(253, 184, 19, 0.16)',
                                        },
                                    },
                                }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<Palette />}
                                onClick={() => setColorModalOpen(true)}
                                fullWidth
                            >
                                Change Group Color
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <ColorPickerModal
                open={colorModalOpen}
                onClose={() => setColorModalOpen(false)}
                lightName={groupName}
                currentHue={0}
                currentSat={0}
                onColorChange={handleColorChange}
            />
        </>
    );
}