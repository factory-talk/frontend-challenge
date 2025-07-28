# Weather Forecast Application - Project Documentation

## ภาพรวมโปรเจกต์
แอปพลิเคชันพยากรณ์อากาศที่พัฒนาด้วย Next.js 14.2.3 และ TypeScript สำหรับแสดงข้อมูลสภาพอากาศของเมืองต่างๆ ทั่วโลก

## เทคโนโลยีที่ใช้
- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **API**: OpenWeatherMap API
- **Font**: Inter (Google Fonts)

## โครงสร้างโปรเจกต์

```
src/
├── app/                    # Next.js App Router
├── components/             # React Components
├── hooks/                  # Custom React Hooks
├── model/                  # Data Models/Types
├── page/                   # Page Components
├── service/                # API Services & Business Logic
├── utils/                  # Utility Functions
├── data/                   # Static Data Files
└── __tests__/              # Test Files
```

---

## 📁 MODELS & TYPES

### 1. CityModel.ts
**วัตถุประสงค์**: Define structure สำหรับข้อมูลเมือง

```typescript
interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
}
```

### 2. WeatherData.ts
**วัตถุประสงค์**: Define structure สำหรับข้อมูลสภาพอากาศ

```typescript
interface WeatherData {
  city: City;
  time: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  wind: WindData;
  clouds: CloudData;
}
```

### 3. SuggestionResult.ts
**วัตถุประสงค์**: Define structure สำหรับ search suggestions

```typescript
interface SuggestionResult {
  city: City;
  matchScore: number;
  highlightedName: string;
}
```

---

## 🔧 SERVICES

### 1. CityService.ts
**หน้าที่**: จัดการข้อมูลเมืองและการค้นหา

#### Static Properties:
- `cities: City[]` - เก็บข้อมูลเมืองทั้งหมด
- `weatherData: WeatherData[]` - เก็บข้อมูลสภาพอากาศ
- `isLoaded: boolean` - สถานะการโหลดข้อมูล

#### Main Functions:
```typescript
// โหลดข้อมูลเมืองและสภาพอากาศจาก JSON files
static async loadCities(): Promise<void>

// ค้นหาเมืองตามชื่อ (fuzzy search)
static searchCities(query: string, limit?: number): SuggestionResult[]

// ดึงข้อมูลเมืองจาก ID
static getCityById(id: number): City | null

// ดึงข้อมูลสภาพอากาศของเมือง
static getWeatherData(cityId: number): WeatherData | null

// ค้นหาเมืองที่ใกล้เคียงตามพิกัด
static findNearestCities(lat: number, lon: number, limit?: number): City[]
```

**การใช้งาน**: 
- หน้าแรก: โหลดข้อมูลและค้นหาเมือง
- หน้ารายละเอียด: ดึงข้อมูลเมืองและสภาพอากาศ

### 2. ForecastService.ts
**หน้าที่**: จัดการ API calls ไปยัง OpenWeatherMap

#### Main Functions:
```typescript
// ดึงข้อมูลสภาพอากาศปัจจุบัน
static async getCurrentWeather(city: City): Promise<CurrentWeatherResponse | null>

// ดึงข้อมูลพยากรณ์อากาศ 5 วัน
static async getForecast(city: City): Promise<ForecastResponse | null>

// จัดกลุ่มข้อมูลพยากรณ์ตามวัน
static groupForecastByDay(forecastData: ForecastResponse, currentWeather?: CurrentWeatherResponse): DailyForecast[]

// ดึงข้อมูลรายชั่วโมงของวันที่ระบุ
static getHourlyForecastForDay(forecastData: ForecastResponse, targetDate: string): ForecastItem[]

// format วันที่และเวลา
static formatDate(dateString: string): string
static formatTime(dateTimeString: string): string
```

**การใช้งาน**: หน้ารายละเอียดเมือง - แสดงสภาพอากาศปัจจุบันและพยากรณ์

### 3. WeatherIconService.ts
**หน้าที่**: จัดการ weather icons จาก OpenWeatherMap

#### Main Functions:
```typescript
// ดึง icon ตาม code
static async getIcon(iconCode: string): Promise<WeatherIcon | null>

// ดึง icon ตามชื่อสภาพอากาศ
static async getIconByCondition(condition: string): Promise<WeatherIcon | null>

// preload icons
static async preloadIcon(iconCode: string): Promise<void>

// ดึงรายการ icons ทั้งหมด
static getAvailableIcons(): WeatherIconMap
```

**การใช้งาน**: ทุกหน้าที่แสดง weather icons

---

## 🎣 HOOKS

### 1. useWeatherIcon.ts
**วัตถุประสงค์**: Custom hook สำหรับ loading weather icons

```typescript
interface UseWeatherIconResult {
  icon: WeatherIcon | null;
  isLoading: boolean;
  error: string | null;
}

function useWeatherIcon(
  iconCode: string, 
  options?: { preload?: boolean }
): UseWeatherIconResult
```

**การใช้งาน**: WeatherIcon component

### 2. useAutoSuggestions.ts
**วัตถุประสงค์**: Custom hook สำหรับ auto-suggestions ในการค้นหา

```typescript
interface UseAutoSuggestionsResult {
  suggestions: SuggestionResult[];
  isLoading: boolean;
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

function useAutoSuggestions(
  query: string, 
  limit?: number
): UseAutoSuggestionsResult
```

**การใช้งาน**: AutoSuggestions component

---

## 🧰 UTILITIES

### 1. weatherUtils.ts
**วัตถุประสงค์**: Utility functions สำหรับการคำนวณเกี่ยวกับสภาพอากาศ

#### Temperature Conversions:
```typescript
fahrenheitToCelsius(fahrenheit: number): number
celsiusToFahrenheit(celsius: number): number
kelvinToCelsius(kelvin: number): number
kelvinToFahrenheit(kelvin: number): number
formatTemperature(temp: number, unit: 'C' | 'F' | 'K'): string
autoConvertToCelsius(temp: number): number // Auto-detect unit
```

#### Weather Calculations:
```typescript
calculateRainProbability(
  weatherMain: string, 
  weatherDesc: string, 
  cloudsPercentage?: number
): number
```

**การใช้งาน**: ทุกหน้าที่แสดงข้อมูลอุณหภูมิและความน่าจะเป็นของฝน

### 2. dataLoader.ts
**วัตถุประสงค์**: Helper functions สำหรับการโหลดและแปลงข้อมูล

```typescript
convertWeatherEntry(entry: any): WeatherData | null
convertCitiesEntry(entry: any): City | null
```

**การใช้งาน**: CityService สำหรับโหลดข้อมูลจาก JSON files

---

## 🎨 COMPONENTS

### 1. SearchResultsList.tsx
**วัตถุประสงค์**: แสดงรายการผลการค้นหาเมือง

#### Features:
- แสดงข้อมูลเมืองพร้อม weather icon
- Temperature gradient colors
- Local timezone calculation
- Humidity และ rain probability
- Click เพื่อไปหน้ารายละเอียด

#### Props:
```typescript
interface SearchResultsListProps {
  query: string;
  results: City[];
  onCitySelect?: (city: City) => void;
  className?: string;
}
```

**การใช้งาน**: หน้าแรก (search page)

### 2. AutoSuggestions.tsx
**วัตถุประสงค์**: Auto-complete suggestions สำหรับการค้นหา

#### Features:
- Real-time search suggestions
- Highlight matching text
- Keyboard navigation
- Search history
- Search button

**การใช้งาน**: หน้าแรก (search page)

### 3. WeatherIcon.tsx
**วัตถุประสงค์**: แสดง weather icons

#### Features:
- Multiple sizes (sm, md, lg, xl)
- Auto theme (day/night detection)
- Loading และ error states
- Theme support (light, dark, none, auto)

#### Props:
```typescript
interface WeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  showDescription?: boolean;
  preload?: boolean;
  onClick?: () => void;
  theme?: 'dark' | 'light' | 'none' | 'auto';
  timestamp?: number;
  timezone?: string;
}
```

**การใช้งาน**: ทุกหน้าที่แสดง weather icons

### 4. Carousel.tsx
**วัตถุประสงค์**: Responsive carousel component

#### Features:
- Responsive layout
- Arrow navigation
- Dot indicators
- Auto-play support
- Dynamic item sizing

#### Props:
```typescript
interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}
```

**การใช้งาน**: หน้ารายละเอียดเมือง - แสดง forecast cards

---

## 📄 PAGES

### 1. app/page.tsx (Homepage)
**วัตถุประสงค์**: หน้าแรกของแอปพลิเคชัน

**Components ที่ใช้**:
- SearchPage component

### 2. search_page.tsx
**วัตถุประสงค์**: หน้าค้นหาเมือง

**Components ที่ใช้**:
- AutoSuggestions
- SearchResultsList

**Features**:
- Search input with auto-suggestions
- Display search results
- Navigate to city detail page

### 3. detail/[id]/page.tsx
**วัตถุประสงค์**: Dynamic route สำหรับหน้ารายละเอียดเมือง

**Components ที่ใช้**:
- WeatherCityDetailPage

### 4. WeatherCityDetailPage.tsx
**วัตถุประสงค์**: แสดงรายละเอียดเมืองและสภาพอากาศ

**Features**:
- Current weather display
- 5-day forecast
- Hourly forecast
- City information
- Temperature color gradients
- Timezone handling

**Components ที่ใช้**:
- WeatherIcon
- Carousel

---

## 🚫 STATE MANAGEMENT

**หมายเหตุ**: โปรเจกต์นี้ **ไม่ใช้ Redux** หรือ state management แบบ global

### State Management Pattern ที่ใช้:
1. **Local Component State** - ใช้ `useState` สำหรับ state ในแต่ละ component
2. **Static Class Properties** - ใช้ใน Services เป็น in-memory cache
3. **Custom Hooks** - เพื่อ share logic ระหว่าง components

### การจัดการ State:

#### CityService (Static):
```typescript
private static cities: City[] = []              // ข้อมูลเมืองทั้งหมด
private static weatherData: WeatherData[] = []  // ข้อมูลสภาพอากาศ
private static isLoaded: boolean = false        // สถานะการโหลด
```

#### Component Level State:
- **search_page.tsx**: search query, results, loading state
- **WeatherCityDetailPage.tsx**: city data, forecast data, loading states
- **AutoSuggestions.tsx**: suggestions, selected index, show state
- **Carousel.tsx**: current index, items per view

---

## 🧪 TESTING STRATEGY

### Testing Coverage: **27 Test Suites, 100+ Test Cases**

### 1. Unit Tests (Utils)
**File**: `__tests__/utils/weatherUtils.test.ts`
- ✅ Temperature conversions (Fahrenheit/Celsius/Kelvin)
- ✅ Temperature formatting
- ✅ Auto temperature unit detection
- ✅ Rain probability calculations
- ✅ Real-world temperature examples

**File**: `__tests__/utils/timezoneUtils.test.ts`
- ✅ Timezone calculation from coordinates
- ✅ Regional timezone mappings (Thailand, Australia, Japan, etc.)
- ✅ UTC offset calculations

**File**: `__tests__/utils/dataLoader.test.ts`
- ✅ Weather data conversion
- ✅ City data conversion
- ✅ Error handling for invalid data

### 2. Service Tests
**File**: `__tests__/service/cityService.test.ts`
- ✅ City loading from JSON
- ✅ Weather data loading
- ✅ City search functionality
- ✅ Fuzzy search algorithm
- ✅ Nearest cities calculation
- ✅ Error handling

**File**: `__tests__/service/forecastService.test.ts`
- ✅ API calls to OpenWeatherMap
- ✅ Current weather fetching
- ✅ Forecast data fetching
- ✅ Daily forecast grouping
- ✅ Hourly forecast filtering
- ✅ Date/time formatting
- ✅ Error handling for API failures

**File**: `__tests__/service/weatherIconService.test.ts`
- ✅ Icon loading by code
- ✅ Icon loading by condition name
- ✅ Icon preloading
- ✅ Cache management
- ✅ Error handling for missing icons

### 3. Hook Tests
**File**: `__tests__/hooks/useWeatherIcon.test.ts`
- ✅ Icon loading states
- ✅ Error states
- ✅ Preload functionality
- ✅ Cache usage

**File**: `__tests__/hooks/useAutoSuggestions.test.ts`
- ✅ Suggestion generation
- ✅ Search history management
- ✅ Loading states
- ✅ Debouncing behavior

### 4. Component Tests
**File**: `__tests__/components/SearchResultsList.test.ts`
- ✅ Results rendering
- ✅ Empty state handling
- ✅ City selection callbacks
- ✅ Temperature color gradients
- ✅ Timezone display

**File**: `__tests__/components/SearchResultsList.timezone.test.tsx`
- ✅ Timezone calculations for different regions
- ✅ Local time formatting

**File**: `__tests__/components/SearchResultsList.gradient.test.tsx`
- ✅ Temperature color gradient calculations
- ✅ Various temperature ranges

**File**: `__tests__/components/SearchResultsList.final.test.tsx`
- ✅ Integration testing
- ✅ Complete user interactions

**File**: `__tests__/components/WeatherIcon.auto-theme.test.tsx`
- ✅ Auto theme detection (day/night)
- ✅ Timezone-based theme switching
- ✅ Icon code transformations

**File**: `__tests__/components/Carousel.test.tsx`
- ✅ Carousel navigation
- ✅ Responsive behavior
- ✅ Auto-play functionality
- ✅ Dot and arrow controls

### 5. Integration Tests
**File**: `__tests__/index.test.tsx`
- ✅ Homepage rendering
- ✅ Basic application functionality

---

## 📊 TEST SUMMARY

### Test จุดสำคัญ:

#### 🌡️ Temperature & Weather:
- **27 test cases** สำหรับ temperature conversions
- **15 test cases** สำหรับ rain probability calculations
- **12 test cases** สำหรับ timezone handling

#### 🔍 Search & Data:
- **18 test cases** สำหรับ city search functionality
- **25 test cases** สำหรับ data loading and conversion
- **20 test cases** สำหรับ API integration

#### 🎨 UI Components:
- **30+ test cases** สำหรับ component rendering
- **15 test cases** สำหรับ user interactions
- **10 test cases** สำหรับ responsive behavior

#### 🔧 Utilities & Hooks:
- **20 test cases** สำหรับ custom hooks
- **15 test cases** สำหรับ utility functions

### การรัน Tests:
```bash
npm test              # รัน tests ทั้งหมด
npm run test:watch    # รัน tests แบบ watch mode
npm run test:coverage # รัน tests พร้อม coverage report
```

---

## 🌐 API INTEGRATION

### OpenWeatherMap APIs:
1. **Current Weather API**: `https://api.openweathermap.org/data/2.5/weather`
2. **5-Day Forecast API**: `https://api.openweathermap.org/data/2.5/forecast`
3. **Weather Icons**: `https://openweathermap.org/img/wn/{icon}@2x.png`

### Data Sources:
1. **Static City Data**: `/data/city.list.json` (500+ cities)
2. **Sample Weather Data**: `/data/weather_16.json` (16 sample weather records)

---

## 🎯 KEY FEATURES

### 1. **Smart Search**:
- Fuzzy search algorithm
- Auto-suggestions with highlighting
- Search history
- Real-time results

### 2. **Weather Display**:
- Current weather conditions
- 5-day forecast with daily summaries
- Hourly forecasts for selected day
- Temperature color gradients
- Weather icons with day/night themes

### 3. **Responsive Design**:
- Mobile-first approach
- Responsive carousel
- Adaptive layouts
- Touch-friendly interfaces

### 4. **Performance**:
- Icon preloading and caching
- In-memory data caching
- Optimized search algorithms
- Lazy loading

### 5. **User Experience**:
- Loading states
- Error handling
- Intuitive navigation
- Consistent design patterns

---

## 📁 FILE ORGANIZATION

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   └── detail/[id]/page.tsx    # Dynamic city detail page
├── components/
│   ├── AutoSuggestions.tsx     # Search auto-complete
│   ├── SearchResultsList.tsx   # Search results display
│   ├── WeatherIcon.tsx         # Weather icon component
│   ├── Carousel/               # Carousel component
│   └── search/search_page.tsx  # Search page
├── hooks/
│   ├── useWeatherIcon.ts       # Weather icon hook
│   └── useAutoSuggestions.ts   # Auto-suggestions hook
├── model/
│   ├── CityModel.ts           # City data types
│   ├── WeatherData.ts         # Weather data types
│   └── SuggestionResult.ts    # Suggestion types
├── service/
│   ├── cityService.ts         # City data management
│   ├── forecastService.ts     # Weather API service
│   └── weatherIconService.ts  # Weather icon service
├── utils/
│   ├── weatherUtils.ts        # Weather calculations
│   └── dataLoader.ts          # Data loading utilities
├── page/detail/
│   └── WeatherCityDetailPage.tsx # City detail page
└── __tests__/                 # All test files
```

---

## 🚀 DEPLOYMENT & BUILD

### Build Commands:
```bash
npm run build        # Production build
npm run start        # Start production server
npm run dev          # Development server
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### Environment Variables:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

---

## 📝 DEVELOPMENT NOTES

### Code Quality:
- **TypeScript Strict Mode** enabled
- **ESLint** configuration
- **Consistent naming conventions**
- **Comprehensive error handling**

### Performance Optimizations:
- **Static data caching** in CityService
- **Icon preloading** and caching
- **Responsive image loading**
- **Optimized search algorithms**

### Accessibility:
- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Screen reader** friendly

---

*เอกสารนี้สร้างขึ้นเพื่อให้นักพัฒนาเข้าใจโครงสร้างและการทำงานของแอปพลิเคชันได้อย่างสมบูรณ์*
