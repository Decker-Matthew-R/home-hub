import express from 'express';
import * as hueService from '../services/hueService';

const router = express.Router();

// Get all groups
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all groups...');
        const groups = await hueService.getAllGroups();
        res.json(groups);
    } catch (error: any) {
        console.error('Failed to fetch groups:', error.message);
        res.status(500).json({ error: 'Failed to fetch groups', message: error.message });
    }
});

// Get single group
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching group ${id}...`);
        const group = await hueService.getGroup(id);
        res.json(group);
    } catch (error: any) {
        console.error('Failed to fetch group:', error.message);
        res.status(500).json({ error: 'Failed to fetch group', message: error.message });
    }
});

// Create new group
router.post('/', async (req, res) => {
    try {
        const { name, lights } = req.body;
        console.log(`Creating group "${name}" with lights:`, lights);
        const result = await hueService.createGroup(name, lights);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Failed to create group:', error.message);
        res.status(500).json({ error: 'Failed to create group', message: error.message });
    }
});

// Update group
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lights } = req.body;
        console.log(`Updating group ${id} - name: "${name}", lights:`, lights);
        const result = await hueService.updateGroup(id, name, lights);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Failed to update group:', error.message);
        res.status(500).json({ error: 'Failed to update group', message: error.message });
    }
});

// Delete group
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting group ${id}...`);
        const result = await hueService.deleteGroup(id);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Failed to delete group:', error.message);
        res.status(500).json({ error: 'Failed to delete group', message: error.message });
    }
});

// Toggle group on/off
router.put('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;
        const { on } = req.body;
        console.log(`Toggling group ${id} to ${on ? 'ON' : 'OFF'}`);
        const result = await hueService.toggleGroupLights(id, on);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Failed to toggle group:', error.message);
        res.status(500).json({ error: 'Failed to toggle group', message: error.message });
    }
});

// Set group brightness
router.put('/:id/brightness', async (req, res) => {
    try {
        const { id } = req.params;
        const { brightness } = req.body;
        console.log(`Setting group ${id} brightness to ${Math.round(brightness * 100)}%`);
        const result = await hueService.setGroupBrightness(id, brightness);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Failed to set group brightness:', error.message);
        res.status(500).json({ error: 'Failed to set group brightness', message: error.message });
    }
});

// Set group color
router.put('/:id/color', async (req, res) => {
    try {
        const { id } = req.params;
        const { hue, sat } = req.body;
        console.log(`Setting group ${id} color - hue: ${hue}, sat: ${sat}`);
        const result = await hueService.setGroupColor(id, hue, sat);
        res.json({ success: true, result });
    } catch (error: any) {
        console.error('Failed to set group color:', error.message);
        res.status(500).json({ error: 'Failed to set group color', message: error.message });
    }
});

export default router;