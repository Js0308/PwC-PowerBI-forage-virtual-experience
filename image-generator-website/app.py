from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import os
import io
import base64
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np
import random
import math
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'generated_images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def create_gradient_image(width, height, color1, color2, direction='horizontal'):
    """Create a gradient image"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    if direction == 'horizontal':
        for x in range(width):
            ratio = x / width
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(x, 0), (x, height)], fill=(r, g, b))
    else:  # vertical
        for y in range(height):
            ratio = y / height
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def create_abstract_art(width, height, complexity=10):
    """Create abstract art with geometric shapes"""
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    # Create background gradient
    colors = [(255, 100, 100), (100, 255, 100), (100, 100, 255), (255, 255, 100), (255, 100, 255)]
    bg_color1 = random.choice(colors)
    bg_color2 = random.choice(colors)
    image = create_gradient_image(width, height, bg_color1, bg_color2, random.choice(['horizontal', 'vertical']))
    draw = ImageDraw.Draw(image)
    
    # Add geometric shapes
    for _ in range(complexity):
        shape_type = random.choice(['circle', 'rectangle', 'triangle', 'line'])
        color = tuple(random.randint(0, 255) for _ in range(3))
        alpha = random.randint(50, 200)
        
        if shape_type == 'circle':
            x = random.randint(0, width)
            y = random.randint(0, height)
            radius = random.randint(20, min(width, height) // 4)
            draw.ellipse([x-radius, y-radius, x+radius, y+radius], fill=color + (alpha,))
        
        elif shape_type == 'rectangle':
            x1 = random.randint(0, width)
            y1 = random.randint(0, height)
            x2 = random.randint(x1, width)
            y2 = random.randint(y1, height)
            draw.rectangle([x1, y1, x2, y2], fill=color + (alpha,))
        
        elif shape_type == 'triangle':
            x1 = random.randint(0, width)
            y1 = random.randint(0, height)
            x2 = random.randint(0, width)
            y2 = random.randint(0, height)
            x3 = random.randint(0, width)
            y3 = random.randint(0, height)
            draw.polygon([(x1, y1), (x2, y2), (x3, y3)], fill=color + (alpha,))
        
        elif shape_type == 'line':
            x1 = random.randint(0, width)
            y1 = random.randint(0, height)
            x2 = random.randint(0, width)
            y2 = random.randint(0, height)
            width_line = random.randint(2, 10)
            draw.line([(x1, y1), (x2, y2)], fill=color, width=width_line)
    
    return image

def create_noise_pattern(width, height, noise_type='random'):
    """Create noise pattern images"""
    if noise_type == 'random':
        # Random noise
        noise = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)
        image = Image.fromarray(noise)
    elif noise_type == 'perlin':
        # Simplified perlin-like noise
        noise = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(height):
            for j in range(width):
                value = int(255 * (math.sin(i * 0.1) + math.cos(j * 0.1)) / 2)
                noise[i, j] = [value, value, value]
        image = Image.fromarray(noise)
    else:
        # Gradient noise
        noise = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(height):
            for j in range(width):
                value = int(255 * (i + j) / (height + width))
                noise[i, j] = [value, value, value]
        image = Image.fromarray(noise)
    
    return image

def create_mandala(width, height, complexity=8):
    """Create mandala patterns"""
    image = Image.new('RGB', (width, height), color='black')
    draw = ImageDraw.Draw(image)
    
    center_x, center_y = width // 2, height // 2
    radius = min(width, height) // 3
    
    colors = [(255, 100, 100), (100, 255, 100), (100, 100, 255), (255, 255, 100), (255, 100, 255), (100, 255, 255)]
    
    for layer in range(complexity):
        current_radius = radius - (layer * radius // complexity)
        num_shapes = 6 + layer * 2
        
        for i in range(num_shapes):
            angle = 2 * math.pi * i / num_shapes
            x = center_x + current_radius * math.cos(angle)
            y = center_y + current_radius * math.sin(angle)
            
            color = colors[layer % len(colors)]
            shape_size = max(5, current_radius // 10)
            
            if layer % 2 == 0:
                # Circles
                draw.ellipse([x-shape_size, y-shape_size, x+shape_size, y+shape_size], 
                           fill=color, outline='white', width=2)
            else:
                # Squares
                draw.rectangle([x-shape_size, y-shape_size, x+shape_size, y+shape_size], 
                             fill=color, outline='white', width=2)
    
    # Add center circle
    draw.ellipse([center_x-20, center_y-20, center_x+20, center_y+20], 
               fill='white', outline='gold', width=3)
    
    return image

def image_to_base64(image):
    """Convert PIL image to base64 string"""
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate/gradient', methods=['POST'])
def generate_gradient():
    try:
        data = request.json
        width = int(data.get('width', 800))
        height = int(data.get('height', 600))
        color1 = tuple(map(int, data.get('color1', [255, 0, 0])))
        color2 = tuple(map(int, data.get('color2', [0, 0, 255])))
        direction = data.get('direction', 'horizontal')
        
        image = create_gradient_image(width, height, color1, color2, direction)
        img_base64 = image_to_base64(image)
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/generate/abstract', methods=['POST'])
def generate_abstract():
    try:
        data = request.json
        width = int(data.get('width', 800))
        height = int(data.get('height', 600))
        complexity = int(data.get('complexity', 10))
        
        image = create_abstract_art(width, height, complexity)
        img_base64 = image_to_base64(image)
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/generate/noise', methods=['POST'])
def generate_noise():
    try:
        data = request.json
        width = int(data.get('width', 800))
        height = int(data.get('height', 600))
        noise_type = data.get('type', 'random')
        
        image = create_noise_pattern(width, height, noise_type)
        img_base64 = image_to_base64(image)
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/generate/mandala', methods=['POST'])
def generate_mandala():
    try:
        data = request.json
        width = int(data.get('width', 800))
        height = int(data.get('height', 600))
        complexity = int(data.get('complexity', 8))
        
        image = create_mandala(width, height, complexity)
        img_base64 = image_to_base64(image)
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/enhance', methods=['POST'])
def enhance_image():
    try:
        data = request.json
        image_data = data.get('image_data')
        enhancement_type = data.get('type', 'brightness')
        factor = float(data.get('factor', 1.2))
        
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Apply enhancement
        if enhancement_type == 'brightness':
            enhancer = ImageEnhance.Brightness(image)
        elif enhancement_type == 'contrast':
            enhancer = ImageEnhance.Contrast(image)
        elif enhancement_type == 'color':
            enhancer = ImageEnhance.Color(image)
        elif enhancement_type == 'sharpness':
            enhancer = ImageEnhance.Sharpness(image)
        else:
            enhancer = ImageEnhance.Brightness(image)
        
        enhanced_image = enhancer.enhance(factor)
        img_base64 = image_to_base64(enhanced_image)
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/filter', methods=['POST'])
def apply_filter():
    try:
        data = request.json
        image_data = data.get('image_data')
        filter_type = data.get('type', 'blur')
        
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Apply filter
        if filter_type == 'blur':
            filtered_image = image.filter(ImageFilter.BLUR)
        elif filter_type == 'sharpen':
            filtered_image = image.filter(ImageFilter.SHARPEN)
        elif filter_type == 'edge':
            filtered_image = image.filter(ImageFilter.FIND_EDGES)
        elif filter_type == 'emboss':
            filtered_image = image.filter(ImageFilter.EMBOSS)
        elif filter_type == 'smooth':
            filtered_image = image.filter(ImageFilter.SMOOTH)
        else:
            filtered_image = image
        
        img_base64 = image_to_base64(filtered_image)
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)