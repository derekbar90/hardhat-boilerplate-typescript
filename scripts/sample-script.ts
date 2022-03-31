// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { Chance } from "chance";
import sharp from "sharp";
import { readdir } from "fs/promises";
import { parseBaseLayer } from "./utils";
import { BASE_LAYER_NAME, LAYERS_WITH_DEPENDENCIES } from "./utils/constants";
import { LayerConfig } from "./utils/types";

async function main() {

  // Sort the assets by index
  const layers = await (await readdir("./scripts/assets"))
    .filter((location) => location.indexOf(".") == -1)
    .sort((a, b) => {
      const aPriority = Number(a.split("_")[0]);
      const bPriority = Number(b.split("_")[0]);
      return aPriority - bPriority;
    });

  // Reverse the order of the layers so that the background is first (lowest priority)
  const processedLayers = layers //.reverse();

  let backgroundLayer: string | null = null;

  // Make x amount of combinations
  let numberOfCombinations = 1;
  
  for (let i = 0; i < numberOfCombinations; i++) {

    // Create the configs for each layer
    let layersConfig: Array<LayerConfig> = [];
    
    // Setup a chance instance, we use this for weighted randomization
    const gamble = new Chance();

    // Loop through each layer
    for (const layer of processedLayers) {

      // Get the metadata for the layer, aka the layer number
      const layerNumber = Number(layer.split("_")[0]);

      // This is a selector which is used for jaw selection etc
      // base currently sets the skin tone
      let baseLayerAttribute;
      
      // We use this because the largest number is the base layer (this might change)
      if (layerNumber == processedLayers.length) {
        console.log("Setting background layer", layer);

        // Fetch all the files in the folder
        const files = await readdir("./scripts/assets/" + layer);

        // Pick one based on random selection
        const file = gamble.pickone(files)
        
        // Set the base layer
        backgroundLayer = `./scripts/assets/${layer}/${file}`;
      } else {
        console.log(`Setting layer ${layerNumber}`, layer);

        // Fetch all the files in the folder
        const files = await readdir("./scripts/assets/" + layer);

        // If the base layer is current layer then 
        // parse the details and save them
        if(layer.indexOf(BASE_LAYER_NAME) > -1) {
          // parse the base layer details  
          baseLayerAttribute = parseBaseLayer(layer);
        }
        
        if(LAYERS_WITH_DEPENDENCIES.some((dependency) => layer.indexOf(dependency) > -1)) {
          // parse the base layer details  
          baseLayerAttribute = parseBaseLayer(layer);
        }
        
        // Pick one based on random selection
        const file = gamble.pickone(files)

        // Add the layer to the composite image
        layersConfig.push({
          priority: layerNumber,
          weight: Math.random(),
          fileLocation: `./scripts/assets/${layer}/${file}`,
        });
      }
    }

    if (backgroundLayer && layers.length > 0) {
      await sharp(backgroundLayer)
        .composite(
          layersConfig.map((layer) => {
            return {
              input: layer.fileLocation,
              gravity: "center",
              ...layer.extraConfig,
            };
          })
        )
        .toFile(`combined_${i}.png`);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
