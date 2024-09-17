import { useEffect, useRef, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { fetchCities } from "../services/weather.service";

export function Search({ onSearchChange, tempUnit, onTempUnitChange }: any): any {

    const [searchValue, setSearchValue] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const loadOptions = async (inputValue: string) => {
        const citiesList = await fetchCities(inputValue);
        console.log('citiesList:', citiesList);

        return {
            options: citiesList.data.map((city: any) => {
                return {
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.countryCode}`,
                };
            }),
        };
    };

    const onChangeHandler = (enteredData: any) => {
        setSearchValue(enteredData);
        onSearchChange(enteredData);
    };

    let useClickOutside = (handler: any) => {
        let domNode = useRef();
        useEffect(() => {
            let maybeHandler = (event: any) => {
                if (!domNode.current.contains(event.target)) {
                    handler();
                }
            };

            document.addEventListener("mousedown", maybeHandler);

            return () => {
                document.removeEventListener("mousedown", maybeHandler);
            };
        });

        return domNode;
    };

    let domNode = useClickOutside(() => {
        setDropdownOpen(false);
    });

    const DropdownItem = ({ label }: any) => {
        return (
            <a
                href="javascript:void(0)"
                className='text-body-color dark:text-dark-6 hover:bg-secondary/5 hover:text-secondary block px-5 py-2 text-base'
                onClick={() => {
                    onTempUnitChange(label);
                    setDropdownOpen(!dropdownOpen);
                }}
            >
                {label}
            </a>
        )
    };

    return (
        <section ref={domNode}>
            <div className='relative inline-block text-left'>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center rounded-[5px] px-5 py-[13px] text-base font-medium text-white`}
                >
                    {tempUnit}
                    <span className="pl-4">
                        <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current"
                        >
                            <path d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z" />
                        </svg>
                    </span>
                </button>
                <div
                    className={`shadow-1 dark:shadow-box-dark absolute left-0 z-40 mt-2 w-full rounded-md bg-gray-50 border border-gray-200 dark:bg-dark-2 py-[10px] transition-all ${dropdownOpen
                            ? 'top-full opacity-100 visible'
                            : 'top-[110%] invisible opacity-0'
                        }`}
                >
                    <DropdownItem label='Celcius' />
                    <DropdownItem label='Farenheit' />
                    <DropdownItem label='Kelvin' />
                </div>
            </div>
            <AsyncPaginate
                placeholder="Search for cities"
                debounceTimeout={600}
                value={searchValue}
                onChange={onChangeHandler}
                loadOptions={loadOptions}
            />
        </section>
    );
}