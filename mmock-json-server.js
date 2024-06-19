const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Function to convert mmock YAML to json-server compatible JSON format
function convertMmockToJSONServer(yamlFilePath, jsonFilePath) {
    try {
        // Load YAML file content
        const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
        const doc = yaml.load(yamlContent);

        // Array to store json-server compatible mock definitions
        const jsonServerMocks = [];

        // Iterate over each mock definition in mmock YAML
        doc.mocks.forEach(mock => {
            const jsonServerMock = {
                [mock.request.method.toLowerCase()]: mock.response.body,
                ...(mock.request.path && { route: mock.request.path })
            };
            jsonServerMocks.push(jsonServerMock);
        });

        // Write JSON file with json-server compatible mocks
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonServerMocks, null, 2));

        console.log(`Conversion successful! JSON file saved at ${jsonFilePath}`);
    } catch (error) {
        console.error(`Error converting ${yamlFilePath} to json-server format:`, error);
    }
}

// Function to process all YAML files in a folder
function convertFolderMmocksToJSONServer(folderPath) {
    try {
        // Read all files in the folder
        const files = fs.readdirSync(folderPath);

        // Filter for YAML files
        const yamlFiles = files.filter(file => path.extname(file).toLowerCase() === '.yaml' || path.extname(file).toLowerCase() === '.yml');

        // Convert each YAML file
        yamlFiles.forEach(yamlFile => {
            const yamlFilePath = path.join(folderPath, yamlFile);
            const jsonFilePath = path.join(folderPath, `${path.basename(yamlFile, path.extname(yamlFile))}.json`);

            convertMmockToJSONServer(yamlFilePath, jsonFilePath);
        });

        console.log('All YAML files converted successfully!');
    } catch (error) {
        console.error('Error converting YAML files:', error);
    }
}

// Example usage: Convert all YAML files in 'mocks' folder
const folderPath = 'mocks'; // Replace with your folder path
convertFolderMmocksToJSONServer(folderPath);