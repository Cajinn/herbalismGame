#!/usr/bin/env bash
# Downloads public-domain botanical plate images from Wikimedia Commons.
# Run from the project root: bash tools/download_plates.sh
# Requires: curl
#
# Each entry: "<filename>" "<Wikimedia_File_URL>"
# URLs must point to the actual image file (Special:FilePath works well).

set -euo pipefail
DEST="assets/plates"
mkdir -p "$DEST"

download() {
  local name="$1"
  local url="$2"
  local dest="$DEST/$name"
  if [[ -f "$dest" ]]; then
    echo "  skip  $name (already exists)"
    return
  fi
  echo "  fetch $name"
  curl -sL --retry 3 -o "$dest" "$url"
}

# ── Starter herbs (M2 / M3) ──────────────────────────────────────────────────
# Sources: Köhler's Medizinal-Pflanzen (1887) and Sturm's Flora von Deutschland
# All images are public domain (pre-1927).

# Löwenzahn (Taraxacum officinale)
# Köhler's Medizinal-Pflanzen, plate 102
download "taraxacum-officinale.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg/800px-Taraxacum_officinale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-135.jpg"

# Brennnessel (Urtica dioica)
# Köhler's Medizinal-Pflanzen
download "urtica-dioica.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Urtica_dioica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-269.jpg/800px-Urtica_dioica_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-269.jpg"

# Spitzwegerich (Plantago lanceolata)
# Köhler's Medizinal-Pflanzen
download "plantago-lanceolata.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Plantago_lanceolata_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-244.jpg/800px-Plantago_lanceolata_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-244.jpg"

# Schafgarbe (Achillea millefolium)
# Köhler's Medizinal-Pflanzen
download "achillea-millefolium.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Achillea_millefolium_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-001.jpg/800px-Achillea_millefolium_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-001.jpg"

# Gänseblümchen (Bellis perennis)
# Sturm, Flora von Deutschland
download "bellis-perennis.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Bellis_perennis_Sturm42.jpg/800px-Bellis_perennis_Sturm42.jpg"

# Huflattich (Tussilago farfara)
# Köhler's Medizinal-Pflanzen
download "tussilago-farfara.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Tussilago_farfara_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-145.jpg/800px-Tussilago_farfara_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-145.jpg"

# Veilchen (Viola odorata)
# Köhler's Medizinal-Pflanzen
download "viola-odorata.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Viola_odorata_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-171.jpg/800px-Viola_odorata_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-171.jpg"

# Bärlauch (Allium ursinum)
# Köhler's Medizinal-Pflanzen
download "allium-ursinum.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Allium_ursinum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-006.jpg/800px-Allium_ursinum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-006.jpg"

# Maiglöckchen (Convallaria majalis)
# Köhler's Medizinal-Pflanzen
download "convallaria-majalis.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Convallaria_majalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-181.jpg/800px-Convallaria_majalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-181.jpg"

# Herbstzeitlose (Colchicum autumnale)
# Köhler's Medizinal-Pflanzen
download "colchicum-autumnale.jpg" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Colchicum_autumnale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-052.jpg/800px-Colchicum_autumnale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-052.jpg"

echo "Done. Plates saved to $DEST/"
