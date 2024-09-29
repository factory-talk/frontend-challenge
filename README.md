# Weather Application

> [!Important]  
> I have developed a more comprehensive version of this assignment, which extends far beyond the original assignment requirements.
>
> To keep things organized, I have separated it into its own repository. You can explore the code [here](https://gitlab.com/korawit.ch605/weather-app-full-stack-nextjs), or even visit the live deployed site at [https://weather.devviantex.com/](https://weather.devviantex.com/).

## Overview
Create a responsive weather application that allows users to search for cities and view current weather conditions. The app features a search box with suggestions, a list of selected cities with current temperatures, and detailed weather information for each city. Users can configure the temperature unit system (Kelvin, Fahrenheit, Celsius).

## Screenshots
![screenshot-1727354938866](https://github.com/user-attachments/assets/cef07ca8-2229-4296-a86c-44c5e69b4537)
![screenshot-1727354949490](https://github.com/user-attachments/assets/a1747430-6d79-44d9-a164-e29dd7608faa)
![screenshot-1727374848942](https://github.com/user-attachments/assets/cef0b952-4796-44d4-98d6-83393198f507)
![screenshot-1727374864121](https://github.com/user-attachments/assets/b0fbc1fe-6bd5-4a35-9b75-56b9b21f33b1)

## Features
### Index Page
- **Search Box:** Allows users to search for cities by name or ZIP code with a suggestion list.
- **City List:** Displays a list of selected cities with the current time and average temperature, enabling users to manage the list.

### Search Bar
- **Auto-Suggestions:** Provides a list of suggested cities based on the user’s input.
- **City Selection:** Allows users to select a city from the suggestion list to add to their index.

### Detail Page
- **City Weather Details:** Displays detailed weather information, including:
    - Average, Minimum, and Maximum Temperature
    - Weather Icon
    - Main Weather (e.g., Rain, Snow, Sunny)
    - Weather Description
    - Wind Speed, Humidity, Pressure, and Rain Volume
- **24-Hour Forecast:** Shows a forecast for the next 24 hours.

### Additional Features
- **Temperature Unit Configuration:** Users can select their preferred temperature unit.
- **Responsive Design:** Ensures usability on various devices.
  
## Technology Stack
- **Framework:** Next.js or React.js
- **Styling:** CSS-in-JS solutions (Styled-Components, Emotion) or CSS frameworks (Bootstrap, Tailwind CSS)
- **Testing:** Unit tests with Jest and React Testing Library
- **Type Checking:** TypeScript for static type checking
- **Best Practices:** Follow best practices for user experience

## Data Source
- **OpenWeather API:** [OpenWeather API](https://openweathermap.org/api)
- **Places API:** [LocationIQ](https://locationiq.com/)

## How to Run the Project

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys (Optional):
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_LOCATIONIQ_API_KEY=your_locationiq_api_key
   ```

### Running the Application
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Running Tests
To run the unit tests:
```bash
npm run test
```

## License
This project is licensed under the MIT License.

## Acknowledgments
- Thank you to the OpenWeather API and LocationIQ for providing the weather and location data.
