export class MathHelper {
    static radians(deg: number): number {
        return deg * Math.PI / 180;
    }

    static degrees(rad: number): number {
        return rad / Math.PI * 180;
    }

    static clamp(value: number, min: number, max: number): number {
        if (value < min) return min;
        if (value > max) return max;

        return value;
    }
}