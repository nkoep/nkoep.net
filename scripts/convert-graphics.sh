#!/bin/sh

die() {
  echo $*
  exit 1
}

if [ $# -ne 1 ]; then
  die "Article slug required"
fi

for p in inkscape svgo; do
  if ! command -v "$p" >/dev/null; then
    die "Executable '$p' not found"
  fi
done

slug="$1"
inputdir="graphics/$slug"
outputdir="static/img/$slug"
mkdir -p "$outputdir"

for f in "$inputdir"/*.pdf; do
  filename="$(basename $f)"
  stem="${filename%.*}"
  inkscape \
    --pdf-poppler \
    --export-plain-svg \
    --export-text-to-path \
    --export-filename "$outputdir/$stem.svg" \
    $f
done
svgo "$outputdir"/*.svg
