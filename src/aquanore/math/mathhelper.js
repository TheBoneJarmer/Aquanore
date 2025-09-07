export class MathHelper {
    static radians(deg) {
        return deg * Math.PI / 180;
    }

    static degrees(rad) {
        return rad / Math.PI * 180;
    }

    static clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;

        return value;
    }
}