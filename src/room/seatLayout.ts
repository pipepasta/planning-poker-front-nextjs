export interface SeatPosition {
    left: string;
    top: string;
}

const pct = (n: number) => `${n.toFixed(1)}%`;

export const seatPositions = (count: number): SeatPosition[] =>
    Array.from({ length: count }, (_, i) => {
        const theta = Math.PI / 2 + (i * 2 * Math.PI) / count;
        return {
            left: pct(50 + 46 * Math.cos(theta)),
            top: pct(50 + 40 * Math.sin(theta)),
        };
    });
