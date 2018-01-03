
interface Device {
    requestPresent(options: any[]);
}

interface Navigator {
    getVRDisplays(): Promise<Device[]>;
}
