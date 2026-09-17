export interface SeatPosition {
    left: string;
    top: string;
}

// Radii of the seat ring as a percentage of the table box. They sit just
// inside the felt's outer edge (the felt is inset 12% on wide screens, so its
// own radii are 38/38) which makes the seat cards tuck onto the table rather
// than hover around it.
const RING_X = 40;
const RING_Y = 34;

const pct = (n: number) => `${n.toFixed(1)}%`;

/**
 * Seat coordinates around the table, starting at bottom centre and running
 * clockwise. `rotateBy` names the participant index that should own the
 * bottom-centre seat, so the local player always sits at the near edge.
 */
export const seatPositions = (count: number, rotateBy = 0): SeatPosition[] =>
    Array.from({ length: count }, (_, i) => {
        const slot = (((i - rotateBy) % count) + count) % count;
        const theta = Math.PI / 2 + (slot * 2 * Math.PI) / count;
        return {
            left: pct(50 + RING_X * Math.cos(theta)),
            top: pct(50 + RING_Y * Math.sin(theta)),
        };
    });
