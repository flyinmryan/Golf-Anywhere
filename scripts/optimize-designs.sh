#!/usr/bin/env bash

# scripts/optimize-designs.sh
# Optimizes golf course design images: converts to WebP, resizes, and organizes.

RAW_DIR="public/images/raw"
OPTIM_DIR="public/images/optimized"

mkdir -p "$OPTIM_DIR/inland"
mkdir -p "$OPTIM_DIR/coastal"

echo "🎨 Optimizing Design Images..."

# Inland
for img in "$RAW_DIR/inland"/*.png; do
    name=$(basename "$img" .png)
    echo "  > Optimizing Inland: $name"
    # Note: sips is macOS only. For other platforms, use ffmpeg or similar if available.
    if command -v sips &> /dev/null; then
        sips -s format jpeg --resampleWidth 1200 "$img" --out "$OPTIM_DIR/inland/$name.jpg" > /dev/null 2>&1
    fi
done

# Coastal
for img in "$RAW_DIR/coastal"/*.png; do
    name=$(basename "$img" .png)
    echo "  > Optimizing Coastal: $name"
    if command -v sips &> /dev/null; then
        sips -s format jpeg --resampleWidth 1200 "$img" --out "$OPTIM_DIR/coastal/$name.jpg" > /dev/null 2>&1
    fi
done

echo "✅ Optimization Complete!"
