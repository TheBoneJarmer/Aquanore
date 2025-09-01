export class MathHelper {
    static radians(deg) {
        return deg * Math.PI / 180;
    }

    static degrees(rad) {
        return rad / Math.PI * 180;
    }
}