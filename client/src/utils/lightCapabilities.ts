export interface LightCapabilities {
    hasColor: boolean;
    hasColorTemp: boolean;
    isDimmable: boolean;
    supportsStreaming: boolean;
    minBrightness: number;
    maxLumen: number;
    colorTempRange?: { min: number; max: number };
}

export interface LightHealth {
    reachable: boolean;
    model: string;
    manufacturer: string;
    productName: string;
    firmwareVersion: string;
    updateAvailable: boolean;
    lastUpdate?: string;
    uniqueId: string;
}

export function getLightCapabilities(light: any): LightCapabilities {
    return {
        hasColor: light.capabilities?.control?.colorgamuttype !== undefined,
        hasColorTemp: light.capabilities?.control?.ct !== undefined,
        isDimmable: light.capabilities?.control?.mindimlevel !== undefined,
        supportsStreaming: light.capabilities?.streaming?.renderer === true,
        minBrightness: light.capabilities?.control?.mindimlevel || 0,
        maxLumen: light.capabilities?.control?.maxlumen || 0,
        colorTempRange: light.capabilities?.control?.ct,
    };
}

export function getLightHealth(light: any): LightHealth {
    return {
        reachable: light.state.reachable,
        model: light.modelid,
        manufacturer: light.manufacturername,
        productName: light.productname,
        firmwareVersion: light.swversion,
        updateAvailable: light.swupdate?.state !== 'noupdates',
        lastUpdate: light.swupdate?.lastinstall,
        uniqueId: light.uniqueid,
    };
}