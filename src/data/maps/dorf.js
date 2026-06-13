// Dorf — village of Oberbottigen rebuilt to match aerial photo.
// North = top (stream/woods). East = right (wiese/fieldland).
//
// Grid: 30 cols × 22 rows. All rows exactly 30 chars.
// North path runs down col 6. E-W road at row 11.
// Herbalist house 4w at cols 20-27, rows 2-7 (roof rows 2-4, wall rows 5-7).
// Shop 3w at cols 9-11, rows 3-7 (roof rows 3-4, wall rows 5-7).
// Notice board (A) col 16, row 7. Door (D) cols 22-23 row 7 → kraeuterhaeuschen.
// Garden fenced plot cols 13-23, rows 12-15. Garten exit col 6 row 21 (south path end).
//
// Tile key (Sprout Lands):
//   grass[55]=flat ground  grass[56]=alt ground  dirt[55]=sandy path  dirt[28]=tilled soil
//   water[0]=water  bridge[8]=horiz bridge plank  biom[36]=big round tree  biom[27]=pink bush
//   house[5/6]=roof-TL/TR  house[12/13]=roof-ML/MR  house[19/20]=roof-BL/BR
//   house[0/1]=wall-top  house[7/8]=wall-window  house[14/15]=wall-brick  house[21/22]=wall-base
//   house[3/10]=door-top/mid  house[2/9/16/23]=side panels (shop col)
//   fences[2]=H-fence-top  fences[12]=H-fence-mid  fences[0]=V-post  chest[0]=closed chest
//   biom[40]=grey rock (notice board)
export const dorf = {
  id: "dorf",
  name: "Dorf",
  tileSize: 16,
  biotope: "dorf",
  legend: {
    // Ground
    ".": { tile: "gras",    solid: false, color: "#7cb342", t: ["grass", 55] },
    ",": { tile: "gras2",   solid: false, color: "#82c044", t: ["grass", 56] },
    "#": { tile: "pfad",    solid: false, color: "#c8aa7a", t: ["dirt",  55] },
    // Water & bridge
    "~": { tile: "wasser",  solid: true,  color: "#4fc3f7", t: ["water",  0] },
    "=": { tile: "bruecke", solid: false, color: "#c8a06a", t: ["bridge", 8] },
    // Trees & bushes — use most-opaque tiles so transparent areas blend into grass color
    "T": { tile: "baum",    solid: true,  color: "#8bc34a", t: ["biom", 28] },
    "B": { tile: "strauch", solid: true,  color: "#8bc34a", t: ["biom", 27] },
    // Garden beds
    "E": { tile: "beet",    solid: false, color: "#8d6e4a", t: ["dirt",  28] },
    // Fences
    "f": { tile: "zaun_h",  solid: true,  color: "#a07848", t: ["fences",  2] },
    "|": { tile: "zaun_v",  solid: true,  color: "#a07848", t: ["fences",  0] },
    "c": { tile: "zaun_c",  solid: true,  color: "#a07848", t: ["fences", 12] },
    // Herbalist house — roof (house sheet cols 5-6 repeated)
    "r": { tile: "dach_tl", solid: true,  color: "#8d6039", t: ["house",  5] },
    "R": { tile: "dach_tr", solid: true,  color: "#8d6039", t: ["house",  6] },
    "m": { tile: "dach_ml", solid: true,  color: "#8d6039", t: ["house", 12] },
    "M": { tile: "dach_mr", solid: true,  color: "#8d6039", t: ["house", 13] },
    "v": { tile: "dach_bl", solid: true,  color: "#7a5230", t: ["house", 19] },
    "V": { tile: "dach_br", solid: true,  color: "#7a5230", t: ["house", 20] },
    // Herbalist house — walls (house sheet cols 0-1 repeated)
    "w": { tile: "wand_t",  solid: true,  color: "#b8997a", t: ["house",  0] },
    "W": { tile: "wand_tr", solid: true,  color: "#b8997a", t: ["house",  1] },
    "g": { tile: "wand_w",  solid: true,  color: "#a1887f", t: ["house",  7] },
    "G": { tile: "wand_wr", solid: true,  color: "#a1887f", t: ["house",  8] },
    "x": { tile: "wand_b",  solid: true,  color: "#9a7060", t: ["house", 14] },
    "X": { tile: "wand_br", solid: true,  color: "#9a7060", t: ["house", 15] },
    // Door (walkable — kraeuterhaeuschen exit)
    "d": { tile: "tuer_t",  solid: false, color: "#7a5c42", t: ["house",  3] },
    "D": { tile: "tuer_m",  solid: false, color: "#7a5c42", t: ["house", 10] },
    // Shop building — use roof tiles (same as house) and wall-window tiles
    "p": { tile: "shop_rt", solid: true,  color: "#8d6039", t: ["house",  5] },
    "P": { tile: "shop_rm", solid: true,  color: "#8d6039", t: ["house", 12] },
    "q": { tile: "shop_rb", solid: true,  color: "#7a5230", t: ["house", 19] },
    "Q": { tile: "shop_wt", solid: true,  color: "#a1887f", t: ["house",  7] },
    // Villager houses — compact 3-tile wide buildings
    "o": { tile: "vill_r",  solid: true,  color: "#8d6039", t: ["house",  5] },
    "O": { tile: "vill_w",  solid: true,  color: "#a1887f", t: ["house",  7] },
    "i": { tile: "vill_b",  solid: true,  color: "#9a7060", t: ["house", 14] },
    // Stations — use fully opaque tiles for visibility
    "S": { tile: "laden",   solid: true,  color: "#c8a844", t: ["chest", 28] },
    "A": { tile: "brett",   solid: true,  color: "#8d6e63", t: ["furniture", 21] },
  },

  // 30 cols × 22 rows
  grid: [
    "TT....=....TT.......TT....TT..",  // 0: top border; col 6 = waldrand exit
    "TT....#....TT.,,....TT....TT..",  // 1: stream crossed by bridge at col 6
    "......#..........B..rRrRrRrR..",  // 2: house roof top
    "......#..rRr.....B..mMmMmMmM..",  // 3: shop roof + house roof mid
    "......#..mMm.....B..vVvVvVvV..",  // 4: shop roof mid + house roof bot
    ".B....#..pPp........wWwWwWwW..",  // 5: shop wall + house wall top
    "......#..qQq........gGgGgGgG..",  // 6: shop wall + house wall window
    "......#..QQQ....A...xXdDxX....",  // 7: shop base, notice board, door cols 22-23
    ".B....#..........B............",  // 8: open
    "......#................B......",  // 9: open
    "......#.......................",  // 10: open — NOTE: 29 chars, pad below
    "##############################",  // 11: E/W exits col 0 & col 29
    "......#......cfffffffc........",  // 12: garden fence top
    ".B....#......fEEEEEEEf........",  // 13: garden beds
    "......#......fEEEEEEEf...B....",  // 14: garden beds
    "......#......cffffffffc.......",  // 15: garden fence bottom
    "oBo...#..ooo...ooo............",  // 16: villager houses
    "OOO...#..OOO...OOO............",  // 17
    "iii...#..iii...iii............",  // 18
    "......#.....B.................",  // 19
    ".B....#..................B....",  // 20
    "......#...........B...........",  // 21: garten exit col 6
  ],
  playerSpawn: { x: 15, y: 9 },
  exits: [
    { x: 6,  y: 0,  target: "waldrand",         spawn: { x: 15, y: 18 } },
    { x: 29, y: 11, target: "wiese",             spawn: { x: 1,  y: 10 } },
    { x: 0,  y: 11, target: "bachufer",          spawn: { x: 28, y: 10 } },
    { x: 22, y: 7,  target: "kraeuterhaeuschen", spawn: { x: 9,  y: 10 } },
    { x: 6,  y: 21, target: "garten",            spawn: { x: 15, y: 1  } },
  ],
  stations: [
    { x: 9,  y: 6, type: "dorfladen"     },
    { x: 16, y: 7, type: "anschlagbrett" },
  ],
};
