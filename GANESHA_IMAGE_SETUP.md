# Instructions to Add the Ganesha Image

## Step 1: Save the Image
1. Right-click on the Ganesha image you provided
2. Save it as `ganesha-logo.png` in the `public` folder of your project
   - Path: `C:\Users\admin\Desktop\KTYA\Digital-Ganesha\public\ganesha-logo.png`

## Step 2: Update the Header Component
Once you've saved the image, you can uncomment the image tag in the Header component:

In `src/components/Header.jsx`, find this section and uncomment the image tag:

```jsx
{/* Uncomment when ganesha-logo.png is added to public folder */}
{/* <img 
  src="/ganesha-logo.png" 
  alt="श्री गणेश" 
  className="w-full h-full object-cover"
/> */}
```

Change it to:

```jsx
<img 
  src="/ganesha-logo.png" 
  alt="श्री गणेश" 
  className="w-full h-full object-cover"
/>
```

And remove or comment out the placeholder:
```jsx
{/* Placeholder until actual image is added */}
{/* <span className="text-2xl">🐘</span> */}
```

## What This Will Give You:
- Beautiful Ganesha image beside the Digital Ganesha text
- Hover effects with scaling and shadow
- Sanskrit text "श्री गणेशाय नमः" below the main title
- Proper spacing and alignment
- Responsive design that works on mobile and desktop

The header will have:
- Ganesha Image (your provided artwork)
- OM Symbol (🕉️)
- "Digital Ganesha" text with Sanskrit subtitle
- All with beautiful hover animations
