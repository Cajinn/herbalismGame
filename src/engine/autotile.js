// Auto-tiling: neighbor-aware tile selection for terrain types.
// Uses 4-bit NESW bitmask (N=8, E=4, S=2, W=1) where each bit is 1 when
// the neighbor in that direction shares the SAME terrain class.
//
// Terrain classes are tagged via `terrain` on legend entries:
//   "path"   — dirt paths (#) across all maps
//   "bed"    — tilled garden beds (E) in dorf + garten
//
// Both terrain types use the "dirt" atlas (tilled_dirt.png, 11 cols).
// The transparent areas in each blob tile let the underlying grass fill show through.
//
// Index derivation: each tile's pixel edge fill was measured at the 4–11 px
// strip midpoints to determine which NESW edges are opaque (= connected) vs
// transparent (= grass). The resulting bitmask→index table is authoritative.

// 4-bit NESW bitmask → tilled_dirt tile index.
// N=8, E=4, S=2, W=1. Picked the first (lowest-index) clean representative
// for each bitmask value based on measured edge-fill ratios.
const DIRT_BLOB = {
  0:  36,  // isolated round blob (no neighbors)
  1:  35,  // W cap — only left edge connects
  2:   1,  // S cap — only bottom edge connects
  3:   7,  // SW corner
  4:  11,  // E cap — only right edge connects
  5:  34,  // EW horizontal strip
  6:   4,  // ES corner (right+bottom open to grass on N+W)
  7:   5,  // ESW T-junction (open on top)
  8:  23,  // N cap — only top edge connects
  9:  16,  // NW corner
  10: 14,  // NS vertical strip
  11: 18,  // NSW T-junction (open on right)
  12: 17,  // NE corner
  13: 38,  // NEW T-junction (open on bottom)
  14: 15,  // NES T-junction (open on left)
  15:  9,  // NESW fully connected interior
};

// Paths also overlay the paths.png fringe texture on top for surface detail.
// This table maps bitmask → paths.png tile index (4 cols).
// Many states map to 0 (minimal texture stub). Blank tiles (0 pixels) are safe
// to draw — they contribute nothing but cost a drawImage call.
const PATH_FRINGE = {
  0:  0,   // isolated — small fringe marks
  1:  0,
  2:  0,
  3:  0,
  4:  4,   // E-neighbor only — left-side fringe
  5:  5,   // E+W — two-sided fringe detail
  6:  6,   // E+S — corner fringe
  7:  0,
  8:  8,   // N-neighbor only — bottom fringe marks
  9:  9,   // N+W — NE fringe detail
  10: 10,  // N+S — NW fringe detail
  11: 0,
  12: 0,
  13: 13,  // N+E+W — right fringe
  14: 14,  // N+E+S — dense fringe
  15: 15,  // all — W-side fringe marks
};

/**
 * Compute the 4-bit NESW bitmask for tile (tx, ty) on `map`,
 * counting only tiles with `terrain === terrainClass` as same-class.
 * Inline neighbor lookup avoids a circular import with tilemap.js.
 */
export function computeBitmask(map, tx, ty, terrainClass) {
  let mask = 0;
  const check = (nx, ny, bit) => {
    const row = map.grid[ny];
    if (row === undefined) return;
    const char = row[nx];
    if (char === undefined) return;
    const def = map.legend[char];
    if (def && def.terrain === terrainClass) mask |= bit;
  };
  check(tx,     ty - 1, 8); // N
  check(tx + 1, ty,     4); // E
  check(tx,     ty + 1, 2); // S
  check(tx - 1, ty,     1); // W
  return mask;
}

/**
 * Return the "dirt" atlas tile index for a terrain tile.
 * Works for both "path" and "bed" terrains (they share the same blob table).
 */
export function dirtBlobIndex(bitmask) {
  return DIRT_BLOB[bitmask] ?? 9;
}

/**
 * Return the "paths" atlas overlay index for a path tile.
 * Draw this on TOP of the dirt-blob tile for additional surface texture.
 */
export function pathFringeIndex(bitmask) {
  return PATH_FRINGE[bitmask] ?? 0;
}
