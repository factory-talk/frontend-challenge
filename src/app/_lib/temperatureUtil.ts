export function unitToMetric (unit: string) {
	if (unit === 'celsius') {
		return 'metric';
	} else if (unit === 'fahrenheit') {
		return 'imperial';
	} else {
		return 'standard';
	}
}

export function unitToSymbol (unit: string) {
	if (unit === 'celsius') {
		return '°C';
	} else if (unit === 'fahrenheit') {
		return '°F';
	} else {
		return 'K';
	}
}