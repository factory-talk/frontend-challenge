export function numberWithCommas(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function celciusToFarenHeit(celcius: number): string {
    return ((celcius * 9/5) + 32).toFixed(2);
}

export function celciusToKelvin(celcius: number): string {
    return (celcius + 273.5).toFixed(2);
}