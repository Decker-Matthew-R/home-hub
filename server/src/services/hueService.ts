import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUE_BRIDGE_IP = process.env.HUE_BRIDGE_IP || '';
const HUE_API_KEY = process.env.HUE_API_KEY || '';

const hueClient = axios.create({
    baseURL: `http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}`,
    timeout: 10000,
    family: 4, // Force IPv4
});

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
    // Hue uses 0-65535 for hue, 0-254 for saturation
    const response = await hueClient.put(`/lights/${lightId}/state`, {
        on: true,
        hue: Math.round(hue * 65535),
        sat: Math.round(sat * 254),
    });
    return response.data;
};