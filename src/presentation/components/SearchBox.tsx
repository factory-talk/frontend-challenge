import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input, List, Empty, Spin, Button, Dropdown, MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@application/states/store';
import CitiesList from '@presentation/components/CitiesList';
import styles from '@presentation/styles/SearchBox.module.css';
import { setSearchResults, clearSearchResults } from '@application/states/slices/searchResultsSlice';
import { Logger } from '@infrastructure/utils/Logger';
import { addCity } from '@application/states/slices/selectedCitiesSlice';
import { updateTemperatureUnit, TemperatureUnit } from '@application/states/slices/temperatureUnitSlice';
import { MenuOutlined } from '@ant-design/icons';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { debounce } from 'lodash'; 

const SearchBox: React.FC<{
  onCitySelect: (city: CityViewModel) => void;
  searchCityOrZip: (query: string) => Promise<CityViewModel[]>;
}> = ({ onCitySelect, searchCityOrZip }) => {
  const [searchInput, setSearchInput] = useState('');
  const [loadingCity, setLoadingCity] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const temperatureUnit = useSelector((state: RootState) => state.temperatureUnit.unit);
  const [isBlurred, setIsBlurred] = useState(false);

  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const citySearchResults = useSelector((state: RootState) => state.searchResults.searchResults);
  const selectedCities = useSelector((state: RootState) => state.selectedCities.cities);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const performSearch = useCallback(
    debounce(async () => {
      const query = searchInput.trim();
      if (query) {
        try {
          const results = await searchCityOrZip(query);
          dispatch(setSearchResults(results));
        } catch (error) {
          Logger.logError('Search error:', error);
          dispatch(setSearchResults([]));
        }
      } else {
        dispatch(clearSearchResults());
      }
    }, 300), 
    [searchInput, searchCityOrZip, dispatch]
  );

  useEffect(() => {
    if (isMounted && searchInput.trim()) {
      performSearch();
    }
  }, [searchInput, isMounted, performSearch]);

  const handleCitySelection = (city: CityViewModel) => {
    if (loadingCity === city.getName()) {
      return;
    }

    setLoadingCity(city.getName());

    try {
      if (!selectedCities.some((c) => c.city.getName() === city.getName())) {
        dispatch(addCity({ city, weather: null }));
      }
      onCitySelect(city);
    } catch (error) {
      Logger.logError('Error selecting city:', error);
    } finally {
      setLoadingCity(null);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement || document.activeElement !== inputRef.current) {
        setIsFocused(false);
        setIsBlurred(true);
      }
    }, 100);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsBlurred(false);
  };

  const clearSearch = () => {
    setSearchInput('');
    dispatch(clearSearchResults());
  };

  if (!isMounted) {
    return <Spin />;
  }

  const handleMenuClick = (unit: TemperatureUnit) => {
    dispatch(updateTemperatureUnit(unit));
  };

  const tempMenuItems: MenuProps['items'] = [
    { key: 'Celsius', label: 'Celsius', className: temperatureUnit === 'Celsius' ? styles.activeMenuTempUnitItem : '' },
    { key: 'Fahrenheit', label: 'Fahrenheit', className: temperatureUnit === 'Fahrenheit' ? styles.activeMenuTempUnitItem : '' },
    { key: 'Kelvin', label: 'Kelvin', className: temperatureUnit === 'Kelvin' ? styles.activeMenuTempUnitItem : '' },
  ];

  const tempMenu: MenuProps = {
    items: tempMenuItems,
    onClick: (e) => handleMenuClick(e.key as TemperatureUnit),
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Dropdown menu={tempMenu} trigger={['click']} placement="bottomRight">
          <Button className={styles.hamburgerButton} icon={<MenuOutlined />} />
        </Dropdown>
      </div>
      <div className={styles.inputContainer}>
        <Input.Search
          ref={inputRef}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search city or zip"
          suffix={searchInput && <span className={styles.clearButton} onClick={clearSearch}>✕</span>}
        />
      </div>

      <div className={`${styles.citiesListContainer} ${searchInput ? styles.blurred : ''}`}>
        {selectedCities.length > 0 && <CitiesList />}
      </div>

      {citySearchResults.length > 0 && (
        <div className={`${styles.searchResultsPlane}`}>
          <div className={`${styles.searchResultsContainer} ${searchInput ? styles.fullScreen : ''}`}>
            <List
              itemLayout="horizontal"
              dataSource={citySearchResults}
              renderItem={(city: CityViewModel) => (
                <div
                  className={`${styles.searchResultItem} ${loadingCity === city.getName() ? styles.loading : ''}`}
                  onClick={() => handleCitySelection(city)}
                >
                  <div className={styles.fontMedium}>{city.getDisplayName()}</div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      {citySearchResults.length === 0 && selectedCities.length === 0 && <Empty className={styles.mt4} description="No Results" />}
    </div>
  );
};

export default React.memo(SearchBox);
