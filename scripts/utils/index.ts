import sharp, { Metadata } from "sharp";

export const parseBaseLayer = (baseLayer: string): string => {
    const parsed = baseLayer.split("/").at(baseLayer.length - 1)
    if(parsed){
        return parsed;
    } else {
        throw new Error('Unable to parse base layer')
    }
}

async function getMetadata(fileLocation: string): Promise<Metadata> {
    return await sharp(fileLocation).metadata();
}