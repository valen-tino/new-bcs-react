# Cloudinary CDN Integration Setup Guide

## 🚀 What Has Been Implemented

✅ **Cloudinary Service** - Complete image upload and optimization service
✅ **Enhanced Image Upload Component** - Supports both file upload and URL input
✅ **Gallery Editor Integration** - Upload methods with automatic optimization
✅ **Announcements Manager Integration** - Banner image upload with CDN support
✅ **Optimized Image Display** - Automatic Cloudinary optimizations in gallery
✅ **Environment Configuration** - Security-compliant credential management

## 📋 Required Setup Steps

### 1. Get Your Cloudinary Cloud Name

1. Go to [https://console.cloudinary.com/](https://console.cloudinary.com/)
2. Sign up or log in to your account
3. On the dashboard, find your **Cloud Name** (it should be displayed prominently)
4. Copy this cloud name

### 2. Update Environment Variables

1. Open the `.env` file in your project root
2. Replace `your_cloud_name_here` with your actual Cloudinary cloud name:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name_here
   ```

### 3. Create Cloudinary Upload Preset

1. In your Cloudinary dashboard, go to **Settings → Upload**
2. Click **Add upload preset**
3. Set the following:
   - **Preset name**: `bcs_visa_images`
   - **Signing Mode**: `Unsigned`
   - **Folder**: Leave empty (will be set dynamically)
   - **Quality**: `Auto`
   - **Format**: `Auto`
   - **Auto-optimization**: Enable all options
4. Save the preset

### 4. Configure Firebase Environment Variables

Make sure your existing Firebase configuration is properly set in the `.env` file. If you don't have these yet, you'll need them from your Firebase project settings.

## 🎯 Features Now Available

### For Gallery Management:
- **File Upload**: Drag & drop or click to upload images
- **URL Input**: Enter external image URLs
- **Automatic Optimization**: Images are automatically compressed and optimized
- **CDN Delivery**: Global fast delivery via Cloudinary's CDN
- **Format Conversion**: Automatic WebP/AVIF conversion for modern browsers
- **Responsive Images**: Multiple sizes generated automatically

### For Announcements:
- **Banner Image Upload**: Enhanced upload with preview
- **URL Fallback**: Still supports direct URL input
- **Metadata Storage**: Tracks image information for better management
- **Optimized Display**: Automatic resizing to 1200x630 for social sharing

### Performance Benefits:
- **25GB Free Storage** on Cloudinary
- **25GB Free Bandwidth** per month
- **Global CDN** for fast worldwide delivery
- **Automatic Optimization** reduces file sizes by 60-80%
- **Modern Formats** (WebP, AVIF) for better performance

## 🔧 Usage Instructions

### Gallery Editor:
1. Go to CMS → Gallery
2. Click "Add Image"
3. Choose between:
   - **📤 Upload File**: Select from your computer
   - **🔗 Image URL**: Enter external URL
4. Add descriptive alt text
5. Save - image is automatically optimized and stored

### Announcements Manager:
1. Go to CMS → Announcements
2. Create or edit an announcement
3. In the "Banner Image" section:
   - Use the upload component for best optimization
   - Or enter a URL in the alternative field
4. Save - banner is optimized for social sharing

## 🛠️ Troubleshooting

### "Missing Cloudinary configuration" Error:
- Check that your cloud name is set correctly in `.env`
- Restart your development server after changing environment variables

### Upload Preset Not Found:
- Ensure you created the `bcs_visa_images` preset in Cloudinary
- Make sure it's set to "Unsigned" mode

### Images Not Loading:
- Check browser console for errors
- Verify your Cloudinary cloud name is correct
- Ensure the upload preset exists and is unsigned

## 🔒 Security Notes

✅ **Environment Variables**: Credentials are properly stored in `.env` files
✅ **Unsigned Uploads**: Uses secure upload presets (no API secret exposed)
✅ **Error Handling**: Graceful fallbacks to Firebase Storage if Cloudinary fails
✅ **Validation**: File type and size validation before upload

## 📊 Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Admin API calls**: 500/hour

For most small to medium websites, this is more than sufficient!

## 🚀 Next Steps

1. **Complete the setup** by adding your cloud name to `.env`
2. **Test the upload** in Gallery Editor
3. **Monitor usage** in your Cloudinary dashboard
4. **Consider upgrading** if you exceed free tier limits

## 💡 Pro Tips

- Use the file upload method for better optimization
- Images are automatically resized and compressed
- Alt text is crucial for SEO and accessibility
- Monitor your Cloudinary usage in the dashboard
- Consider setting up automatic backups for important images

---

**Need Help?** Check the browser console for detailed error messages or refer to [Cloudinary's documentation](https://cloudinary.com/documentation).