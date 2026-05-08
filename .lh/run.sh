#!/usr/bin/env bash
set +e
BASE=http://127.0.0.1:4173
ROUTES=("home:/" "collections:/#/collections" "challenges:/#/challenges" "profile:/#/profile" "settings:/#/settings")
FLAGS='--chrome-flags=--headless=new --quiet --output=json --output=html --only-categories=performance,accessibility,best-practices'
for entry in "${ROUTES[@]}"; do
  name=${entry%%:*}; path=${entry#*:}
  for ff in mobile desktop; do
    extra=""
    [ "$ff" = "desktop" ] && extra="--preset=desktop"
    echo ">>> $name $ff"
    lighthouse "$BASE$path" $extra --output=json --output=html --output-path=".lh/$name-$ff" --chrome-flags="--headless=new --no-sandbox" --quiet --only-categories=performance,best-practices,accessibility 2>&1 | tail -5
  done
done
echo "ALL DONE"
