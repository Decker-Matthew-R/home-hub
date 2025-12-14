import axios from 'axios';

const API_BASE = 'http://192.168.1.2:3001/api';

export interface Light {
    name: string;
    state: {
        on: boolean;
        bri: number;
        hue: number;
        sat: number;
        reachable: boolean;
    };
    type: string;
}

export interface LightsResponse {
    [id: string]: Light;
}

export const fetchLights = async (): Promise<LightsResponse> => {
    const { data } = await axios.get(`${API_BASE}/hue/lights`);
    return data;
};

export const toggleLight = async (lightId: string, on: boolean) => {
    const { data } = await axios.put(`${API_BASE}/hue/lights/${lightId}/toggle`, { on });
    return data;
};

export const setBrightness = async (lightId: string, brightness: number) => {
    const { data } = await axios.put(`${API_BASE}/hue/lights/${lightId}/brightness`, { brightness });
    return data;
};

export const setColor = async (lightId: string, hue: number, sat: number) => {
    const { data } = await axios.put(`${API_BASE}/hue/lights/${lightId}/color`, { hue, sat });
    return data;
};

// NEW: All lights functions
export const toggleAllLights = async (on: boolean) => {
    const { data } = await axios.put(`${API_BASE}/hue/all/toggle`, { on });
    return data;
};

export const setAllLightsBrightness = async (brightness: number) => {
    const { data } = await axios.put(`${API_BASE}/hue/all/brightness`, { brightness });
    return data;
};

export const setAllLightsColor = async (hue: number, sat: number) => {
    const { data } = await axios.put(`${API_BASE}/hue/all/color`, { hue, sat });
    return data;
};