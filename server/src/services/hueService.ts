import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUE_BRIDGE_IP = process.env.HUE_BRIDGE_IP || '';
const HUE_API_KEY = process.env.HUE_API_KEY || '';

const hueClient = axios.create({
    baseURL: `http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}`,
    timeout: 10000,
    family: 4,
});

// Lights
export const getAllLights = async () => {
    const response = await hueClient.get('/lights');
    return response.data;
};

export const toggleLight = async (lightId: string, on: boolean) => {
    const response = await hueClient.put(`/lights/${lightId}/state`, { on });
    return response.data;
};

export const setLightBrightness = async (lightId: string, brightness: number) => {
    const bri = Math.max(1, Math.round(brightness * 254));
    const response = await hueClient.put(`/lights/${lightId}/state`, {
        on: true,
        bri,
    });
    return response.data;
};

export const setLightColor = async (lightId: string, hue: number, sat: number) => {
    const response = await hueClient.put(`/lights/${lightId}/state`, {
        on: true,
        hue: Math.round(hue * 65535),
        sat: Math.round(sat * 254),
    });
    return response.data;
};

// All lights
export const toggleAllLights = async (on: boolean) => {
    const response = await hueClient.put('/groups/0/action', { on });
    return response.data;
};

export const setAllLightsBrightness = async (brightness: number) => {
    const bri = Math.max(1, Math.round(brightness * 254));
    const response = await hueClient.put('/groups/0/action', {
        on: true,
        bri,
    });
    return response.data;
};

export const setAllLightsColor = async (hue: number, sat: number) => {
    const response = await hueClient.put('/groups/0/action', {
        on: true,
        hue: Math.round(hue * 65535),
        sat: Math.round(sat * 254),
    });
    return response.data;
};

// NEW: Groups
export const getAllGroups = async () => {
    const response = await hueClient.get('/groups');
    return response.data;
};

export const getGroup = async (groupId: string) => {
    const response = await hueClient.get(`/groups/${groupId}`);
    return response.data;
};

export const createGroup = async (name: string, lights: string[]) => {
    const response = await hueClient.post('/groups', {
        name,
        lights,
        type: 'LightGroup',
    });
    return response.data;
};

export const updateGroup = async (groupId: string, name: string, lights: string[]) => {
    const response = await hueClient.put(`/groups/${groupId}`, {
        name,
        lights,
    });
    return response.data;
};

export const deleteGroup = async (groupId: string) => {
    const response = await hueClient.delete(`/groups/${groupId}`);
    return response.data;
};

export const toggleGroupLights = async (groupId: string, on: boolean) => {
    const response = await hueClient.put(`/groups/${groupId}/action`, { on });
    return response.data;
};

export const setGroupBrightness = async (groupId: string, brightness: number) => {
    const bri = Math.max(1, Math.round(brightness * 254));
    const response = await hueClient.put(`/groups/${groupId}/action`, {
        on: true,
        bri,
    });
    return response.data;
};

export const setGroupColor = async (groupId: string, hue: number, sat: number) => {
    const response = await hueClient.put(`/groups/${groupId}/action`, {
        on: true,
        hue: Math.round(hue * 65535),
        sat: Math.round(sat * 254),
    });
    return response.data;
};