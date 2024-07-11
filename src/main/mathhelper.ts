export class MathHelper {
    public static radians(deg: number) {
        return deg * Math.PI / 180;
    }

    public static degrees(rad: number) {
        return rad / Math.PI * 180;
    }
}