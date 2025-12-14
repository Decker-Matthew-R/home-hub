import { Modal, Box, Typography, Button } from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { useState, useEffect, useMemo } from 'react';
import { throttle } from 'lodash';

interface ColorPickerModalProps {
    open: boolean;
    onClose: () => void;
    lightName: string;
    currentHue: number;
    currentSat: number;
    onColorChange: (hue: number, sat: number) => void;
}

// Convert Hue HSV to Hex
function hsvToHex(h: number, s: number, v: number): string {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert Hex to Hue HSV
function hexToHsv(hex: string): { h: number; s: number; v: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
            h = ((b - r) / delta + 2) / 6;
        } else {
            h = ((r - g) / delta + 4) / 6;
        }
    }

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return {
        h: h * 360,
        s: s * 100,
        v: v * 100,
    };
}

export function ColorPickerModal({
                                     open,
                                     onClose,
                                     lightName,
                                     currentHue,
                                     currentSat,
                                     onColorChange,
                                 }: ColorPickerModalProps) {
    const hueToAngle = (currentHue / 65535) * 360;
    const satToPercent = (currentSat / 254) * 100;
    const initialHex = hsvToHex(hueToAngle, satToPercent, 100);

    const [color, setColor] = useState(initialHex);

    useEffect(() => {
        const hueAngle = (currentHue / 65535) * 360;
        const satPercent = (currentSat / 254) * 100;
        setColor(hsvToHex(hueAngle, satPercent, 100));
    }, [currentHue, currentSat]);

    // Throttle color changes to every 300ms
    const throttledColorChange = useMemo(
        () => throttle((hex: string) => {
            const hsv = hexToHsv(hex);
            const hue = hsv.h / 360;
            const sat = hsv.s / 100;
            onColorChange(hue, sat);
        }, 300),
        [onColorChange]
    );

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        throttledColorChange(newColor); // Real-time updates while dragging
    };

    const handleApply = () => {
        // Final update on apply
        const hsv = hexToHsv(color);
        const hue = hsv.h / 360;
        const sat = hsv.s / 100;
        onColorChange(hue, sat);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    minWidth: 320,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Set Color - {lightName}
                </Typography>

                <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                    <HexColorPicker color={color} onChange={handleColorChange} />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleApply}>
                        Apply
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}