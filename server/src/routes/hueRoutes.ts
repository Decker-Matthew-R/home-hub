import express from 'express';
import * as hueService from '../services/hueService';

const router = express.Router();

// Get all lights
router.get('/lights', async (req, res) => {
    try {
        console.log('Fetching all lights...');
        const lights = await hueService.getAllLights();
        res.json(lights);
    } catch (error: any) {
        console.error('Failed to fetch lights:', error.message);
        res.status(500).json({ error: 'Failed to fetch lights', message: error.message });
    }
});

// Toggle light on/off
router.put('/lights/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;
        const { on } = req.body;

        console.log(`Toggling light ${id} to ${on ? 'ON' : 'OFF'}`);

        const result = await hueService.toggleLight(id, on);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Toggle failed:', error.message);
        res.status(500).json({ error: 'Failed to toggle light', message: error.message });
    }
});

// Set brightness
router.put('/lights/:id/brightness', async (req, res) => {
    try {
        const { id } = req.params;
        const { brightness } = req.body;

        console.log(`Setting light ${id} brightness to ${Math.round(brightness * 100)}%`);

        const result = await hueService.setLightBrightness(id, brightness);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Brightness change failed:', error.message);
        res.status(500).json({ error: 'Failed to set brightness', message: error.message });
    }
});

// Set color
router.put('/lights/:id/color', async (req, res) => {
    try {
        const { id } = req.params;
        const { hue, sat } = req.body; // 0-1 range for both

        console.log(`Setting light ${id} color - hue: ${hue}, sat: ${sat}`);

        const result = await hueService.setLightColor(id, hue, sat);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Color change failed:', error.message);
        res.status(500).json({ error: 'Failed to set color', message: error.message });
    }
});

export default router;