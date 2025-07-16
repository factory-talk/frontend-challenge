import { convertUnits } from '../../util/convert-unit'

describe('convertUnits', () => {
    it('should return °C when unit is metric', () => {
        expect(convertUnits('metric')).toBe('°C')
    })

    it('should return °F when unit is imperial', () => {
        expect(convertUnits('imperial')).toBe('°F')
    })

    it('should return °K when unit is standard', () => {
        expect(convertUnits('standard')).toBe('°K')
    })
})
