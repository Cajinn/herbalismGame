#!/usr/bin/env bash
# Downloads public-domain botanical plate images from Wikimedia Commons.
# Run from the project root: bash tools/download_plates.sh
# Requires: curl
#
# Uses Special:FilePath redirect — curl -L follows 302→301→200 automatically,
# so we never need to hard-code the per-file hash in the upload path.
#
# Sources:
#   Köhler — Köhler's Medizinal-Pflanzen, F.E. Köhler, 1887/1890/1898
#   Thomé  — Flora von Deutschland, O.W. Thomé, 1885–1905
#   Sturm  — Flora von Deutschland, J. Sturm, 1796–1855
# All published before 1927 → public domain worldwide.

set -euo pipefail
DEST="assets/plates"
mkdir -p "$DEST"

download() {
  local name="$1"
  local wikimedia_filename="$2"   # exact Commons filename, spaces as underscores
  local dest="$DEST/$name"
  if [[ -f "$dest" ]] && [[ $(wc -c < "$dest") -gt 10000 ]]; then
    echo "  skip  $name (already exists)"
    return
  fi
  echo "  fetch $name"
  local encoded
  # percent-encode the filename for the URL (python available on macOS/Linux)
  encoded=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$wikimedia_filename")
  curl -sL --retry 3 -o "$dest" \
    "https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}"
  local size
  size=$(wc -c < "$dest")
  if [[ $size -lt 10000 ]]; then
    echo "  WARN  $name appears too small (${size} bytes) — check URL"
  fi
}

# ── M4 starters ───────────────────────────────────────────────────────────────

# Löwenzahn (Taraxacum officinale) — Köhler pl. 135
download "taraxacum-officinale.jpg" \
  "Taraxacum_officinale_-_Köhler–s_Medizinal-Pflanzen-135.jpg"

# Brennnessel (Urtica dioica) — Köhler pl. 269
download "urtica-dioica.jpg" \
  "Urtica_dioica_-_Köhler–s_Medizinal-Pflanzen-269.jpg"

# Spitzwegerich (Plantago lanceolata) — Köhler pl. 244
download "plantago-lanceolata.jpg" \
  "Plantago_lanceolata_-_Köhler–s_Medizinal-Pflanzen-244.jpg"

# Schafgarbe (Achillea millefolium) — Köhler pl. 1
download "achillea-millefolium.jpg" \
  "Achillea_millefolium_-_Köhler–s_Medizinal-Pflanzen-001.jpg"

# Gänseblümchen (Bellis perennis) — Sturm vol. 42
download "bellis-perennis.jpg" \
  "Bellis_perennis_Sturm42.jpg"

# Huflattich (Tussilago farfara) — Köhler pl. 145
download "tussilago-farfara.jpg" \
  "Tussilago_farfara_-_Köhler–s_Medizinal-Pflanzen-145.jpg"

# Veilchen (Viola odorata) — Köhler pl. 171
download "viola-odorata.jpg" \
  "Viola_odorata_-_Köhler–s_Medizinal-Pflanzen-171.jpg"

# Bärlauch (Allium ursinum) — Köhler pl. 6
download "allium-ursinum.jpg" \
  "Allium_ursinum_-_Köhler–s_Medizinal-Pflanzen-006.jpg"

# Maiglöckchen (Convallaria majalis) — Köhler pl. 181
download "convallaria-majalis.jpg" \
  "Convallaria_majalis_-_Köhler–s_Medizinal-Pflanzen-181.jpg"

# Herbstzeitlose (Colchicum autumnale) — Köhler pl. 52
download "colchicum-autumnale.jpg" \
  "Colchicum_autumnale_-_Köhler–s_Medizinal-Pflanzen-052.jpg"

# ── Additional herbs (WP2–WP7) ────────────────────────────────────────────────

# Ringelblume (Calendula officinalis) — Köhler pl. 185
download "calendula-officinalis.jpg" \
  "Calendula_officinalis_-_Köhler–s_Medizinal-Pflanzen-185.jpg"

# Kamille (Matricaria chamomilla) — Köhler pl. 174
download "matricaria-chamomilla.jpg" \
  "Matricaria_chamomilla_-_Köhler–s_Medizinal-Pflanzen-174.jpg"

# Pfefferminze (Mentha × piperita) — Köhler pl. 98
download "mentha-piperita.jpg" \
  "Mentha_piperita_-_Köhler–s_Medizinal-Pflanzen-098.jpg"

# Johanniskraut (Hypericum perforatum) — Köhler pl. 81
download "hypericum-perforatum.jpg" \
  "Hypericum_perforatum_-_Köhler–s_Medizinal-Pflanzen-081.jpg"

# Rotklee (Trifolium pratense) — Köhler pl. 263
download "trifolium-pratense.jpg" \
  "Trifolium_pratense_-_Köhler–s_Medizinal-Pflanzen-263.jpg"

# Frauenmantel (Alchemilla vulgaris) — Thomé
download "alchemilla-vulgaris.jpg" \
  "Alchemilla_vulgaris_(Thomé).jpg"

# Malve (Malva sylvestris) — Köhler pl. 89
download "malva-sylvestris.jpg" \
  "Malva_sylvestris_-_Köhler–s_Medizinal-Pflanzen-089.jpg"

# Wegwarte (Cichorium intybus) — Köhler pl. 49
download "cichorium-intybus.jpg" \
  "Cichorium_intybus_-_Köhler–s_Medizinal-Pflanzen-049.jpg"

# Königskerze (Verbascum thapsus) — Köhler pl. 152
download "verbascum-thapsus.jpg" \
  "Verbascum_thapsus_-_Köhler–s_Medizinal-Pflanzen-152.jpg"

# Giersch (Aegopodium podagraria) — Thomé
download "aegopodium-podagraria.jpg" \
  "Aegopodium_podagraria_(Thomé).jpg"

# Gundelrebe (Glechoma hederacea) — Thomé
download "glechoma-hederacea.jpg" \
  "Glechoma_hederacea_(Thomé).jpg"

# Holunder (Sambucus nigra) — Köhler pl. 120
download "sambucus-nigra.jpg" \
  "Sambucus_nigra_-_Köhler–s_Medizinal-Pflanzen-120.jpg"

# Hagebutte / Hundsrose (Rosa canina) — Köhler pl. 118
download "rosa-canina.jpg" \
  "Rosa_canina_-_Köhler–s_Medizinal-Pflanzen-118.jpg"

# Weißdorn (Crataegus monogyna) — Köhler pl. 57
download "crataegus-monogyna.jpg" \
  "Crataegus_monogyna_-_Köhler–s_Medizinal-Pflanzen-057.jpg"

# Schlehe (Prunus spinosa) — Thomé
download "prunus-spinosa.jpg" \
  "Prunus_spinosa_(Thomé).jpg"

# Birke (Betula pendula) — Thomé
download "betula-pendula.jpg" \
  "Betula_pendula_(Thomé).jpg"

# Schlüsselblume (Primula veris) — Köhler pl. 112
download "primula-veris.jpg" \
  "Primula_veris_-_Köhler–s_Medizinal-Pflanzen-112.jpg"

# Mädesüß (Filipendula ulmaria) — Köhler pl. 67
download "filipendula-ulmaria.jpg" \
  "Filipendula_ulmaria_-_Köhler–s_Medizinal-Pflanzen-067.jpg"

# Beinwell (Symphytum officinale) — Köhler pl. 133
download "symphytum-officinale.jpg" \
  "Symphytum_officinale_-_Köhler–s_Medizinal-Pflanzen-133.jpg"

# Zitronenmelisse (Melissa officinalis) — Köhler pl. 99
download "melissa-officinalis.jpg" \
  "Melissa_officinalis_-_Köhler–s_Medizinal-Pflanzen-099.jpg"

# Salbei (Salvia officinalis) — Köhler pl. 121
download "salvia-officinalis.jpg" \
  "Salvia_officinalis_-_Köhler–s_Medizinal-Pflanzen-121.jpg"

# Thymian (Thymus vulgaris) — Köhler pl. 141
download "thymus-vulgaris.jpg" \
  "Thymus_vulgaris_-_Köhler–s_Medizinal-Pflanzen-141.jpg"

# Lavendel (Lavandula angustifolia) — Köhler pl. 87
download "lavandula-angustifolia.jpg" \
  "Lavandula_angustifolia_-_Köhler–s_Medizinal-Pflanzen-087.jpg"

# Baldrian (Valeriana officinalis) — Köhler pl. 150
download "valeriana-officinalis.jpg" \
  "Valeriana_officinalis_-_Köhler–s_Medizinal-Pflanzen-150.jpg"

# Linde (Tilia cordata) — Köhler pl. 142
download "tilia-cordata.jpg" \
  "Tilia_cordata_-_Köhler–s_Medizinal-Pflanzen-142.jpg"

# Arnika (Arnica montana) — Köhler pl. 15
download "arnica-montana.jpg" \
  "Arnica_montana_-_Köhler–s_Medizinal-Pflanzen-015.jpg"

# Gelber Enzian (Gentiana lutea) — Köhler pl. 71
download "gentiana-lutea.jpg" \
  "Gentiana_lutea_-_Köhler–s_Medizinal-Pflanzen-071.jpg"

# Wacholder (Juniperus communis) — Köhler
download "juniperus-communis.jpg" \
  "Juniperus_communis_-_Köhler–s_Medizinal-Pflanzen-081b.jpg"

# ── Herbs currently plate:null — plates sourced for future wiring ─────────────
# Update the herb's `plate` field and re-run to activate in-game.

# Quendel / Feldthymian (Thymus serpyllum) — Köhler pl. 140
# → plate: "thymus-serpyllum.jpg"
download "thymus-serpyllum.jpg" \
  "Thymus_serpyllum_-_Köhler–s_Medizinal-Pflanzen-140.jpg"

# Roter Fingerhut (Digitalis purpurea) — Köhler pl. 59
# → plate: "digitalis-purpurea.jpg"
download "digitalis-purpurea.jpg" \
  "Digitalis_purpurea_-_Köhler–s_Medizinal-Pflanzen-059.jpg"

# Attich / Zwerg-Holunder (Sambucus ebulus) — Thomé
# → plate: "sambucus-ebulus.jpg"
download "sambucus-ebulus.jpg" \
  "Sambucus_ebulus_(Thomé).jpg"

# Pestwurz (Petasites hybridus) — Thomé
# → plate: "petasites-hybridus.jpg"
download "petasites-hybridus.jpg" \
  "Petasites_hybridus_(Thomé).jpg"

# Weide / Silberweide (Salix alba) — Köhler pl. 119
# → plate: "salix-alba.jpg"
download "salix-alba.jpg" \
  "Salix_alba_-_Köhler–s_Medizinal-Pflanzen-119.jpg"

# Hundskamille (Anthemis cotula) — Thomé
# → plate: "anthemis-cotula.jpg"
download "anthemis-cotula.jpg" \
  "Anthemis_cotula_(Thomé).jpg"

# Gefleckter Schierling (Conium maculatum) — Köhler pl. 54
# → plate: "conium-maculatum.jpg"
download "conium-maculatum.jpg" \
  "Conium_maculatum_-_Köhler–s_Medizinal-Pflanzen-054.jpg"

# Jakobskreuzkraut (Senecio jacobaea) — Thomé
# → plate: "senecio-jacobaea.jpg"
download "senecio-jacobaea.jpg" \
  "Senecio_jacobaea_(Thomé).jpg"

# Hundspetersilie (Aethusa cynapium) — Thomé
# → plate: "aethusa-cynapium.jpg"
download "aethusa-cynapium.jpg" \
  "Aethusa_cynapium_(Thomé).jpg"

# Alpenfrauenmantel (Alchemilla alpina) — Thomé
# → plate: "alchemilla-alpina.jpg"
download "alchemilla-alpina.jpg" \
  "Alchemilla_alpina_(Thomé).jpg"

# Fichte (Picea abies) — Thomé
# → plate: "picea-abies.jpg"
download "picea-abies.jpg" \
  "Picea_abies_(Thomé).jpg"

# Note: Zwiebel and Zitrone are kitchen anchors — sprite fallback intentional.

echo "Done. Plates saved to $DEST/"
