from flask import Flask, render_template, request, jsonify, send_file
import os
import io
import base64
import random
import math
from PIL import Image, ImageDraw
import json

app = Flask(__name__)

# Create upload directory
os.makedirs('static/images', exist_ok=True)

def create_simple_gradient(width, height, color1, color2):
    """Create a simple gradient"""
    try:
        image = Image.new('RGB', (width, height))
        pixels = image.load()
        
        for y in range(height):
            for x in range(width):
                # Calculate gradient ratio
                ratio = x / width
                
                # Interpolate colors
                r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
                g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
                b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
                
                pixels[x, y] = (r, g, b)
        
        return image
    except Exception as e:
        print(f"Error creating gradient: {e}")
        return None

def create_simple_pattern(width, height, pattern_type):
    """Create simple patterns"""
    try:
        image = Image.new('RGB', (width, height), 'white')
        draw = ImageDraw.Draw(image)
        
        if pattern_type == 'circles':
            colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 0, 255)]
            for _ in range(20):
                x = random.randint(0, width)
                y = random.randint(0, height)
                radius = random.randint(10, 50)
                color = random.choice(colors)
                draw.ellipse([x-radius, y-radius, x+radius, y+radius], fill=color)
        
        elif pattern_type == 'rectangles':
            colors = [(255, 100, 100), (100, 255, 100), (100, 100, 255), (255, 255, 100)]
            for _ in range(15):
                x1 = random.randint(0, width-50)
                y1 = random.randint(0, height-50)
                x2 = x1 + random.randint(20, 100)
                y2 = y1 + random.randint(20, 100)
                color = random.choice(colors)
                draw.rectangle([x1, y1, x2, y2], fill=color)
        
        elif pattern_type == 'lines':
            colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
            for _ in range(30):
                x1 = random.randint(0, width)
                y1 = random.randint(0, height)
                x2 = random.randint(0, width)
                y2 = random.randint(0, height)
                color = random.choice(colors)
                draw.line([(x1, y1), (x2, y2)], fill=color, width=3)
        
        return image
    except Exception as e:
        print(f"Error creating pattern: {e}")
        return None

def create_simple_mandala(width, height):
    """Create a simple mandala"""
    try:
        image = Image.new('RGB', (width, height), 'black')
        draw = ImageDraw.Draw(image)
        
        center_x, center_y = width // 2, height // 2
        colors = [(255, 100, 100), (100, 255, 100), (100, 100, 255), (255, 255, 100)]
        
        # Draw concentric circles
        for i in range(5):
            radius = 30 + i * 20
            color = colors[i % len(colors)]
            draw.ellipse([center_x-radius, center_y-radius, center_x+radius, center_y+radius], 
                        outline=color, width=3)
        
        # Draw radiating lines
        for i in range(12):
            angle = i * (360 / 12)
            x = center_x + 80 * math.cos(math.radians(angle))
            y = center_y + 80 * math.sin(math.radians(angle))
            draw.line([(center_x, center_y), (x, y)], fill='white', width=2)
        
        return image
    except Exception as e:
        print(f"Error creating mandala: {e}")
        return None

def image_to_base64(image):
    """Convert image to base64"""
    try:
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    except Exception as e:
        print(f"Error converting to base64: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
    try:
        data = request.json
        image_type = data.get('type', 'gradient')
        width = int(data.get('width', 400))
        height = int(data.get('height', 300))
        
        # Limit size to prevent memory issues
        width = min(width, 1000)
        height = min(height, 1000)
        
        image = None
        
        if image_type == 'gradient':
            color1 = tuple(data.get('color1', [255, 0, 0]))
            color2 = tuple(data.get('color2', [0, 0, 255]))
            image = create_simple_gradient(width, height, color1, color2)
        
        elif image_type == 'pattern':
            pattern_type = data.get('pattern', 'circles')
            image = create_simple_pattern(width, height, pattern_type)
        
        elif image_type == 'mandala':
            image = create_simple_mandala(width, height)
        
        if image:
            img_base64 = image_to_base64(image)
            if img_base64:
                return jsonify({
                    'success': True,
                    'image': f'data:image/png;base64,{img_base64}'
                })
        
        return jsonify({'success': False, 'error': 'Failed to generate image'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)