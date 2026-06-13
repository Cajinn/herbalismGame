// Wald — deep forest. Dense trees with occasional clearings.
// Path runs north-south; exits: south → waldrand, north → alpweide.
// Sprout Lands: dark grass fill, dense tree biom tiles, path.
// grass[66] = row 6 col 0 = darker grass with tiny detail marks (forest floor)
// grass[55] = lighter grass for clearings
// biom[39]  = large round green bush = "tree" (most opaque, 195/256)
// biom[27]  = pink bush (forest floor detail)
export const wald = {
  id: "wald",
  name: "Wald",
  tileSize: 16,
  biotope: "wald",
  legend: {
    ".": { tile: "waldboden", solid: false, color: "#3f5e2a", t: ["grass", 66] },
    "#": { tile: "pfad",      solid: false, color: "#c9b896", t: ["dirt",  55], terrain: "path" },
    "T": { tile: "baum",      solid: true,  color: "#1b4d1f", t: ["biom",  39] },
    "F": { tile: "lichtung",  solid: false, color: "#74945a", t: ["grass", 55] },
    "B": { tile: "strauch",   solid: true,  color: "#2e7d32", t: ["biom",  27] },
  },
  grid: [
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTFFFFFTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT#TTTTTTTTTTTTTTT",
  ],
  playerSpawn: { x: 15, y: 18 },
  exits: [
    // South ← back to the stream (bachufer). North is a dead end (deep forest).
    { x: 15, y: 19, target: "bachufer", spawn: { x: 1, y: 10 } },
  ],
};
