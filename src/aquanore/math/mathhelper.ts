export class MathHelper {
    /**
     * Converts degrees to radians
     * @param {number} deg - Degrees
     * @returns {number}
     */
    static radians(deg: number): number {
        return deg * Math.PI / 180;
    }

    /**
     * Converts radians to degrees
     * @param {number} rad - Radians
     * @returns {number}
     */
    static degrees(rad: number): number {
        return rad / Math.PI * 180;
    }

    /**
     * Constrains a value to not go lower than min and not higher than max
     * @param value - The value
     * @param min - The minimum to clamp to
     * @param max - The maximum to clamp to
     * @returns {number}
     */
    static clamp(value: number, min: number, max: number): number {
        if (value < min) return min;
        if (value > max) return max;

        return value;
    }
}