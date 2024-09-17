import axios from "axios";
import { useEffect, useState, useRef } from "react";

export function SavedLocations({ onClickSavedLocation, onRemoveSavedLocation, onLoadAllSavedLocations, savedLocations }: any) {

    const [displayLocations, setDisplayLocations] = useState([]);
    const savedLocationsComponent = useRef();

    const loadAllSavedLocations = async () => {
        const data = await onLoadAllSavedLocations();
    }

    const removeSavedLocation = async (id: number) => {
        await onRemoveSavedLocation(id);
        loadAllSavedLocations();
    }

    const printSavedLocations = (savedLocation: PlaceLocation) => {
        return (
            <div className="flex items-center border-b border-stroke px-6 py-5 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark">
                <div className="flex w-full items-center">
                    <div className="w-full flex">
                        <h4 className="text-base font-medium text-dark dark:text-white sm:min-w-[220px]">
                            <a href="javascript:void(0)" onClick={() => {
                                    const selectedLocation = {
                                        label: savedLocation.name,
                                        value: `${savedLocation.latitude} ${savedLocation.longtitude}`
                                    };
                                    onClickSavedLocation(selectedLocation);
                                }
                            }>{savedLocation.name}</a>
                        </h4>
                        <p className="text-base text-body-color dark:text-dark-6 ms-12 right items-end">
                            <button className='bg-red-700 text-sm dark:bg-dark-2 border-dark dark:border-dark-2 border rounded-md inline-flex items-center justify-center py-2 px-4 text-center text-base font-medium text-white hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'
                                onClick={() => removeSavedLocation(savedLocation.id)}>
                                Remove
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        loadAllSavedLocations();
    }, []);

    useEffect(() => {
        if (savedLocations) {
            if (savedLocations.length > 0) {
                savedLocationsComponent.current.classList.remove('hidden');
            } else {
                savedLocationsComponent.current.classList.add('hidden');
            }

            const savedItems = [];
            for (const savedItem of savedLocations) {
                savedItems.push(printSavedLocations(savedItem));
            }
            setDisplayLocations(savedItems);
        }
    }, [savedLocations]);

    return (
        <section className="grid mt-3 hidden" ref={savedLocationsComponent}>
            <div className="shadow-xs mx-auto w-full rounded-[5px] bg-white p-4 dark:bg-dark-2">
                {displayLocations}
            </div>
        </section>
    );
}