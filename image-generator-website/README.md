# 🎨 AI Image Generator Website

A modern, full-featured web application for generating high-quality images using advanced algorithms and AI techniques. Create stunning gradients, abstract art, noise patterns, mandalas, and enhance existing images with powerful filters and enhancements.

## 🌟 Features

### Image Generation
- **Gradient Generator**: Create beautiful color gradients with customizable colors and directions
- **Abstract Art Generator**: Generate unique abstract artwork with adjustable complexity
- **Noise Pattern Generator**: Create various noise patterns (random, perlin-like, gradient)
- **Mandala Generator**: Generate intricate mandala patterns with customizable complexity

### Image Enhancement
- **Brightness Control**: Adjust image brightness with precision
- **Contrast Enhancement**: Improve image contrast for better visibility
- **Color Saturation**: Enhance or reduce color intensity
- **Sharpness**: Make images sharper or softer
- **Filters**: Apply various filters (blur, sharpen, edge detection, emboss, smooth)

### User Interface
- **Modern Design**: Beautiful, responsive UI with gradient backgrounds and animations
- **Real-time Preview**: See your images as they're generated
- **Download Support**: Download generated images in PNG format
- **Gallery System**: Save and manage your generated images locally
- **Mobile Responsive**: Works perfectly on all devices

### Technical Features
- **High Resolution**: Generate images up to any size you need
- **Fast Processing**: Optimized algorithms for quick generation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **File Upload**: Upload existing images for enhancement
- **Local Storage**: Gallery persists between sessions

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip package manager

### Installation

#### Option 1: Using the Start Script (Recommended)
1. **Navigate to the project directory**
   ```bash
   cd image-generator-website
   ```

2. **Run the start script**
   ```bash
   ./start.sh
   ```
   This will automatically create a virtual environment, install dependencies, and start the server.

3. **Open your browser**
   Navigate to `http://localhost:5000`

#### Option 2: Manual Installation
1. **Navigate to the project directory**
   ```bash
   cd image-generator-website
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install Flask Flask-CORS Pillow numpy
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🎯 Usage Guide

### Generating Images

1. **Select Generation Type**
   - Choose from Gradient, Abstract Art, Noise Patterns, or Mandala tabs
   - Each type has specific customization options

2. **Configure Parameters**
   - Set image dimensions (width x height)
   - Adjust type-specific settings (colors, complexity, etc.)
   - Use sliders and color pickers for precise control

3. **Generate Image**
   - Click the "Generate" button
   - Watch the loading animation
   - Your image will appear in the preview area

### Enhancing Images

1. **Load an Image**
   - Generate a new image OR upload an existing one
   - The image will appear in the preview area

2. **Choose Enhancement**
   - Select enhancement type (brightness, contrast, color, sharpness)
   - Adjust the enhancement factor using the slider
   - Click "Enhance" to apply

3. **Apply Filters**
   - Choose from various filters (blur, sharpen, edge detection, etc.)
   - Click "Apply Filter" to see the effect

### Managing Images

- **Download**: Save any generated image to your device
- **Save to Gallery**: Store images in your personal gallery
- **Gallery Management**: View, select, and delete saved images
- **Clear**: Remove the current image from preview

## 🛠️ Technical Details

### Backend (Flask)
- **Framework**: Flask with CORS support
- **Image Processing**: PIL (Pillow) for image manipulation
- **Algorithms**: Custom algorithms for gradients, abstract art, noise, and mandalas
- **API Endpoints**: RESTful endpoints for all generation and enhancement functions

### Frontend (HTML/CSS/JavaScript)
- **Responsive Design**: CSS Grid and Flexbox for modern layouts
- **Interactive Controls**: Real-time parameter adjustment
- **Animations**: Smooth transitions and loading indicators
- **Local Storage**: Browser-based gallery management

### Image Processing Features
- **Gradient Generation**: Mathematical color interpolation
- **Abstract Art**: Procedural generation with geometric shapes
- **Noise Patterns**: Multiple noise algorithms including perlin-like
- **Mandala Creation**: Geometric pattern generation with symmetry
- **Enhancement**: Brightness, contrast, color, and sharpness adjustments
- **Filters**: Professional image filters and effects

## 📁 Project Structure

```
image-generator-website/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── generated_images/     # Directory for saved images (created automatically)
```

## 🎨 Customization

### Adding New Generation Types
1. Create a new generation function in `app.py`
2. Add a new route for the API endpoint
3. Add the corresponding UI tab in `index.html`
4. Implement the JavaScript function for API calls

### Modifying Existing Algorithms
- Edit the generation functions in `app.py`
- Adjust parameters, colors, or complexity calculations
- All changes will be reflected immediately

### UI Customization
- Modify CSS styles in `index.html`
- Change colors, fonts, layouts, or animations
- Add new form controls or interface elements

## 🔧 Configuration

### Image Settings
- Default image size: 800x600 pixels
- Maximum recommended size: 2000x2000 pixels
- Supported formats: PNG (for output), JPG/PNG (for upload)

### Performance Optimization
- Images are processed in-memory for speed
- Base64 encoding for efficient transfer
- Optimized algorithms for real-time generation

## 🐛 Troubleshooting

### Common Issues

1. **Module Not Found Error**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`

2. **Port Already in Use**
   - Change the port in `app.py`: `app.run(port=5001)`

3. **Image Not Generating**
   - Check browser console for JavaScript errors
   - Verify Flask server is running properly

4. **Upload Not Working**
   - Ensure file is a valid image format
   - Check file size (recommended < 10MB)

## 🚀 Deployment

### Local Development
- Use the built-in Flask development server (as shown in Quick Start)
- Enable debug mode for development: `app.run(debug=True)`

### Production Deployment
- Use a production WSGI server like Gunicorn
- Configure proper static file serving
- Set up environment variables for configuration

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

For support, please open an issue in the project repository or contact the development team.

---

**Created with ❤️ for the creative community**

Enjoy creating stunning images with our AI Image Generator!