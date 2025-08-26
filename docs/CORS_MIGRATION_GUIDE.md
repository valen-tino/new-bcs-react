# CORS-Safe Image Migration Guide 🔄

## Quick Migration Steps

If you encounter CORS issues with other image components, here's how to quickly fix them:

### 1. Import the Component
```jsx
import CORSSafeImage from '../components/CORSSafeImage';
// or adjust the path based on your component location
```

### 2. Replace img Tags

**Before** (Standard img tag):
```jsx
<img 
  src={imageUrl} 
  alt="Description" 
  className="w-8 h-6" 
/>
```

**After** (CORS-safe):
```jsx
<CORSSafeImage 
  src={imageUrl} 
  alt="Description" 
  className="w-8 h-6"
  useProxy={true}
  ariaHidden={false}
/>
```

### 3. Configuration Options

```jsx
<CORSSafeImage 
  src={imageUrl}                    // Required: Image URL
  alt="Description"                 // Alt text for accessibility
  className="w-8 h-6"              // CSS classes
  useProxy={true}                   // Enable proxy fallbacks
  ariaHidden={false}                // For decorative images, set to true
  fallbackSrc="/fallback.png"      // Custom fallback image
  onError={(e) => console.log(e)}   // Custom error handler
  onLoad={(e) => console.log(e)}    // Custom load handler
/>
```

## Common Use Cases

### Country Flags
```jsx
<CORSSafeImage 
  src={country.flag} 
  alt="" 
  ariaHidden={true}
  className="w-6 h-4 object-cover" 
  useProxy={true}
/>
```

### External Images with Fallback
```jsx
<CORSSafeImage 
  src={externalImageUrl} 
  alt="User avatar"
  className="w-10 h-10 rounded-full" 
  fallbackSrc="/default-avatar.png"
  useProxy={true}
/>
```

### Gallery Images
```jsx
<CORSSafeImage 
  src={galleryImage.url} 
  alt={galleryImage.caption}
  className="w-full h-64 object-cover" 
  useProxy={false}  // Cloudinary images usually don't need proxy
/>
```

## When to Use

✅ **Use CORSSafeImage when**:
- Loading external images (wikimedia, worldometers, etc.)
- Image sources are user-generated/dynamic
- You want automatic fallback handling
- CORS errors appear in console

❌ **Regular img is fine for**:
- Local/static images (`/images/logo.png`)
- Same-origin images
- Cloudinary images (usually CORS-friendly)
- SVG icons embedded in code

## Error Handling

The component provides several levels of fallback:

1. **Original URL** - Try the provided URL first
2. **Alternative CDNs** - For flags, try flagcdn.com
3. **Proxy Services** - Route through CORS-friendly proxies
4. **SVG Placeholder** - Final fallback for broken images

## Performance Tips

- Set `useProxy={false}` for images you know work (like Cloudinary)
- Use `ariaHidden={true}` for decorative images (improves accessibility)
- Provide `fallbackSrc` for important images that must always display

## Quick Fix Command

To quickly find and replace img tags in a file:

**Search for**: `<img.*src=.*>`  
**Replace with**: `<CORSSafeImage ... useProxy={true} />`

Don't forget to:
1. Add the import statement
2. Convert `aria-hidden="true"` to `ariaHidden={true}`
3. Test the component works as expected

## Browser Support

The component works in all modern browsers and gracefully degrades in older ones by falling back to standard img behavior.

---

Need help migrating a specific component? Check the examples in:
- `src/sections/services/services.jsx` (flag images)
- `src/components/cms/VisaAbroadEditor.jsx` (CMS preview)