import { ailments } from "../data/ailments.js";

// Returns every { ailmentId, output } pair where this species appears as a
// valid remedy — i.e. the reverse-lookup of ailments.validRemedies.
export function remediesForSpecies(speciesId) {
  const result = [];
  for (const [ailmentId, ailment] of Object.entries(ailments)) {
    for (const r of ailment.validRemedies) {
      if (r.species === speciesId) {
        result.push({ ailmentId, output: r.output });
      }
    }
  }
  return result;
}

// Returns one representative { species, output } from ailment.validRemedies,
// or null if there are none.
export function exampleRemedy(ailment) {
  return ailment.validRemedies[0] ?? null;
}
