# Screenshot Instructions

## How to Add Screenshots to README

### Step 1: Take Screenshots
1. Open the demo application: `http://localhost:4200`
2. Take a full-page screenshot showing both Material and Bootstrap examples
3. Save as `demo-screenshot.png`

### Step 2: Save Screenshots
Save the following screenshots in the `docs/images/` folder:

1. **demo-screenshot.png** - Full demo showing both examples
2. **material-example.png** - Material Design section only
3. **bootstrap-example.png** - Bootstrap section only

### Step 3: Recommended Screenshot Sizes
- Full demo: 1200px width
- Individual sections: 800px width
- Use PNG format for best quality

### Step 4: Optimize Images (Optional)
```bash
# Install image optimizer
npm install -g imagemin-cli

# Optimize images
imagemin docs/images/*.png --out-dir=docs/images
```

## Current Screenshot Locations

The README references these images:
- `docs/images/demo-screenshot.png` - Main demo screenshot
- `docs/images/material-example.png` - Material Design example
- `docs/images/bootstrap-example.png` - Bootstrap example

## Quick Screenshot Capture

### Using Browser DevTools
1. Open DevTools (F12)
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "screenshot"
4. Select "Capture full size screenshot"

### Using Windows Snipping Tool
1. Press Win+Shift+S
2. Select area to capture
3. Save to `docs/images/`

### Using Mac Screenshot
1. Press Cmd+Shift+4
2. Select area to capture
3. Save to `docs/images/`

---

**Note:** Make sure to commit the images to Git:
```bash
git add docs/images/*.png
git commit -m "Add demo screenshots"
git push
```
