# Anime Runner - Base Miniapp

This is a Base miniapp version of the Anime Runner game. Follow these instructions to deploy and configure your miniapp.

## Deployment Instructions

1. Deploy this project to Vercel or any static hosting service
2. Update the URLs in the following files with your deployment URL:
   - `.well-known/farcaster.json` - Update all URLs to point to your deployment
   - `index.html` - Update the meta tag with your deployment URL

## Configuration Steps

1. After deploying, visit your deployed URL to ensure it's working
2. Update the `farcaster.json` file with your actual Base account address:
   ```json
   "baseBuilder": {
     "ownerAddress": "YOUR_BASE_ACCOUNT_ADDRESS_HERE"
   }
   ```

3. Generate account association credentials:
   - Visit the Base Build Account association tool
   - Enter your deployed domain
   - Generate the accountAssociation fields
   - Update the `farcaster.json` file with the generated values

4. Create the required assets:
   - icon.png (app icon)
   - splash.png (splash screen image)
   - screenshot1.png, screenshot2.png (app screenshots)
   - hero.png (hero image for the app store)
   - og.png (Open Graph image)
   - embed-image.png (image for embeds)

## Technical Details

- Uses Lexend font from Google Fonts
- Compatible with Farcaster MiniApp SDK
- Responsive design that works on mobile and desktop
- Game controls: Tap/click or press Space to jump

## File Structure

- `index.html` - Main HTML file with meta tags for miniapp
- `style.css` - Stylesheet with Lexend font integration
- `script.js` - Game logic with MiniApp SDK integration
- `.well-known/farcaster.json` - Miniapp manifest file

## Next Steps

1. Deploy to Vercel
2. Configure the manifest file
3. Generate account association credentials
4. Test the miniapp in Base app
5. Share your miniapp with the Farcaster community!