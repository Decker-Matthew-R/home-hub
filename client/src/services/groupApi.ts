import axios from 'axios';

const API_BASE = 'http://192.168.1.2:3001/api';

export interface Group {
    name: string;
    lights: string[];
    type: string;
    action?: {
        on: boolean;
        bri: number;
        hue: number;
        sat: number;
    };
}

export interface GroupsResponse {
    [id: string]: Group;
}

export const fetchGroups = async (): Promise<GroupsResponse> => {
    const { data } = await axios.get(`${API_BASE}/groups`);
    return data;
};

export const fetchGroup = async (groupId: string): Promise<Group> => {
    const { data } = await axios.get(`${API_BASE}/groups/${groupId}`);
    return data;
};

export const createGroup = async (name: string, lights: string[]) => {
    const { data } = await axios.post(`${API_BASE}/groups`, { name, lights });
    return data;
};

export const updateGroup = async (groupId: string, name: string, lights: string[]) => {
    const { data } = await axios.put(`${API_BASE}/groups/${groupId}`, { name, lights });
    return data;
};

export const deleteGroup = async (groupId: string) => {
    const { data } = await axios.delete(`${API_BASE}/groups/${groupId}`);
    return data;
};

export const toggleGroup = async (groupId: string, on: boolean) => {
    const { data } = await axios.put(`${API_BASE}/groups/${groupId}/toggle`, { on });
    return data;
};

export const setGroupBrightness = async (groupId: string, brightness: number) => {
    const { data } = await axios.put(`${API_BASE}/groups/${groupId}/brightness`, { brightness });
    return data;
};

export const setGroupColor = async (groupId: string, hue: number, sat: number) => {
    const { data } = await axios.put(`${API_BASE}/groups/${groupId}/color`, { hue, sat });
    return data;
};