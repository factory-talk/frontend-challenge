import { render, screen } from '@testing-library/react';
import Index from '../app/index';
import { addLocation, clearTestData, getAllLocations, getLocation, removeLocation } from 'src/app/services/savedlocation.service';

describe('Home', () => {
	it('renders without errors', () => {
		const { container } = render(<Index />);
		expect(container).toBeDefined();
	});
});

describe('Saved locations', () => {

	const testPlace1: PlaceLocation = {
		id: 1,
		name: 'Bangkok',
		latitude: 13.736717,
		longtitude: 100.523186
	};

	const testPlace2: PlaceLocation = {
		id: 2,
		name: 'Guildford',
		latitude: 51.240551,
		longtitude: -0.580243
	};

	const testPlace3: PlaceLocation = {
		id: 3,
		name: 'Ontario',
		latitude: 50.000000,
		longtitude: -85.000000
	};

	it('should not has any saved locations', async () => {
		// Arrange
		await clearTestData();

		// Action
		const savedLocations = await getAllLocations(true);

		// Assert
		expect(savedLocations).toHaveLength(0);
	});

	it('should retrieve recently saved location', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);

		// Action
		const savedLocations = await getAllLocations(true);

		// Assert
		expect(savedLocations).toHaveLength(1);

		expect(savedLocations[0].name).toBe(testPlace1.name);
		expect(savedLocations[0].latitude).toBe(testPlace1.latitude);
		expect(savedLocations[0].longtitude).toBe(testPlace1.longtitude);
	});

	it('should retrieve all saved locations correctly', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);
		await addLocation(testPlace2, true);

		// Action
		const savedLocations = await getAllLocations(true);

		// Assert
		expect(savedLocations).toHaveLength(2);

		expect(savedLocations[0].name).toBe(testPlace1.name);
		expect(savedLocations[0].latitude).toBe(testPlace1.latitude);
		expect(savedLocations[0].longtitude).toBe(testPlace1.longtitude);

		expect(savedLocations[1].name).toBe(testPlace2.name);
		expect(savedLocations[1].latitude).toBe(testPlace2.latitude);
		expect(savedLocations[1].longtitude).toBe(testPlace2.longtitude);
	});

	it('should retrieve specific saved locations correctly', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);
		await addLocation(testPlace2, true);
		await addLocation(testPlace3, true);

		// Action
		const savedLocation = await getLocation(testPlace2.id, true);

		// Assert
		expect(savedLocation.name).toBe(testPlace2.name);
		expect(savedLocation.latitude).toBe(testPlace2.latitude);
		expect(savedLocation.longtitude).toBe(testPlace2.longtitude);
	});

	it('should not retrieve not existed location', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);
		await addLocation(testPlace3, true);

		// Action
		const getNonExistedLocation = async () => {
			await getLocation(testPlace2.id, true);
		};

		// Assert
		expect(getNonExistedLocation).rejects.toThrow(`Location id '${testPlace2.id}' not found on the saved locations.`);
	});

	it('should not be able to add an existed location', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);
		await addLocation(testPlace2, true);

		// Action
		const savedLocations = await getAllLocations(true);
		const addExistedLocation = async () => {
			await addLocation(testPlace1, true);
		};

		// Assert
		expect(addExistedLocation).rejects.toThrow(`The location '${testPlace1.name}' already existed.`);
		expect(savedLocations).toHaveLength(2);
	});

	it('should remove specific location correctly', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);
		await addLocation(testPlace2, true);
		await addLocation(testPlace3, true);

		// Action
		await removeLocation(testPlace1.id, true);
		const savedLocations = await getAllLocations(true);
		const getRemovedLocation = async () => {
			await getLocation(testPlace1.id, true);
		};

		// Assert
		expect(savedLocations).toHaveLength(2);
		expect(getRemovedLocation).rejects.toThrow(`Location id '${testPlace1.id}' not found on the saved locations.`);
	});

	it('should not be able to remove non-existed location.', async () => {
		// Arrange
		await clearTestData();
		await addLocation(testPlace1, true);
		await addLocation(testPlace3, true);

		// Action
		const removeNonExistedLocation = async () => {
			await removeLocation(testPlace2.id, true);
		};

		// Assert
		expect(removeNonExistedLocation).rejects.toThrow(`The location id '${testPlace2.id}' does not exist.`);
	});
});