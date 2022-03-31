export type LayerConfig = {
    priority: number;
    weight: number;
    fileLocation: string;
    extraConfig?: { [key: string]: any };
};