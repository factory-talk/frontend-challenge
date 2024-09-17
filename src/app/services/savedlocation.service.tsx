import fs from "fs";

function setFileName(isTest: boolean = false) {
    let fileName: string | undefined = process.env.SAVED_LOCATIONS_FILE; // Use the file located within the same path.
    if (isTest) {
        fileName = "saved_locations_test.json";
    }

    if (!fileName) {
        throw new Error('Missing required environment variables.');
    }

    return fileName;
}

export async function getLocation(cityId: number, isTest: boolean = false): Promise<PlaceLocation> {

    // Validate required data
    if (!cityId) {
        throw new Error('Required city name not provided.');
    }

    // Prepare saved locations
    const fileName = setFileName(isTest);
    const dataFileExisted = fs.existsSync(fileName);
    
    let findLocation: PlaceLocation;
    const locationNotFoundMsg: string = `Location id '${cityId}' not found on the saved locations.`;
    if (dataFileExisted) {

        // Get all saved locations.
        const jsonData = await fs.promises.readFile(fileName);
        const savedLocations = JSON.parse(jsonData.toString());
        if (!savedLocations) {
            throw new Error(locationNotFoundMsg);
        }
        
        // Look up city name on saved locations.
        findLocation = savedLocations.find((item: PlaceLocation) =>
            item.id == cityId
        );
    } else {
        // Saved locations not found, throw error.
        throw new Error(locationNotFoundMsg);
    }

    // Not found city on saved locations, throw error.
    if (!findLocation) {
        throw new Error(locationNotFoundMsg);
    }

    return findLocation;
}

export async function getAllLocations(isTest: boolean = false): Promise<PlaceLocation[]> {

    // Prepare saved locations
    const fileName = setFileName(isTest);
    const dataFileExisted = fs.existsSync(fileName);

    let savedLocations: PlaceLocation[] = [];
    if (dataFileExisted) {
        const jsonData = await fs.promises.readFile(fileName);
        savedLocations = JSON.parse(jsonData.toString());
    }

    return savedLocations;
}

export async function addLocation(newPlaceLocation: PlaceLocation, isTest: boolean = false): Promise<void> {
    
    if (newPlaceLocation.latitude == 0 || newPlaceLocation.longtitude == 0) {
        throw new Error('Required latitude and longtitude information not provided.');
    }

    // Prepare saved locations.
    const fileName = setFileName(isTest);
    const dataFileExisted = fs.existsSync(fileName);

    // Check if data file existed.
    let savedLocations: PlaceLocation[] = [];
    if (dataFileExisted) {
        // Get data from files
        const jsonData = await fs.promises.readFile(fileName);
        savedLocations = JSON.parse(jsonData.toString());

        // Find existed item
        const foundLocation = savedLocations.find((item: PlaceLocation) =>
            item.id == newPlaceLocation.id
        );

        // Found an existed item
        if (foundLocation) {
            throw new Error(`The location '${newPlaceLocation.name}' already existed.`);
        }
    }

    // Item not found in the saved locations, save the location to an array.
    savedLocations.push(newPlaceLocation);

    // Overwrite saved locations data to a new file
    await fs.promises.writeFile(fileName, JSON.stringify(savedLocations));
    
}

export async function removeLocation(cityId: number, isTest: boolean = false): Promise<void> {

    // Validate required data
    if (!cityId) {
        throw new Error('Required city name not provided.');
    }

    // Prepare saved locations.
    const fileName = setFileName(isTest);
    const dataFileExisted = fs.existsSync(fileName);

    // Check if data file existed.
    const locationNotExistMessage = `The location id '${cityId}' does not exist.`;
    let savedLocations: PlaceLocation[] = [];
    let beforeRemoveLength = 0;
    if (dataFileExisted) {
        // Get data from files
        const jsonData = await fs.promises.readFile(fileName);
        savedLocations = JSON.parse(jsonData.toString());

        // Find existed item
        const foundIndex = savedLocations.map(item => {
            return item.id
        }).indexOf(cityId);

        // Found an existed item
        if (foundIndex == -1) {
            throw new Error(locationNotExistMessage);
        }

        // Item found in the saved locations, delete found index from an array.
        beforeRemoveLength = savedLocations.length;
        savedLocations.splice(foundIndex, 1);
    } else {
        throw new Error(locationNotExistMessage);
    }

    // Overwrite saved locations data to a new file
    if (beforeRemoveLength == 1) {
        await fs.promises.rm(fileName);
    } else {
        await fs.promises.writeFile(fileName, JSON.stringify(savedLocations));
    }
}

export async function clearTestData() {
    const fileName = setFileName(true);
    const dataFileExisted = fs.existsSync(fileName);

    if (dataFileExisted) {
        await fs.promises.rm(fileName);
    }
}