from PIL import Image, ImageDraw

# Create a blank image with a specific size (e.g., 1920x1080)
width, height = 1920, 1080
image = Image.new("RGB", (width, height), (200, 200, 200))  # Light gray background

# Add text or visual patterns if needed
draw = ImageDraw.Draw(image)
text = "Placeholder"
text_position = (width // 3, height // 2)
draw.text(text_position, text, fill=(0, 0, 0))  # Black text

# Save the image to the desired directory
image.save("images/hero-bg.jpg")
print("Placeholder image created!")
