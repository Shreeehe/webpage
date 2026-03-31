from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=200):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check if pixel is close to white
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            newData.append((255, 255, 255, 0)) # Fully transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent logo to {output_path}")

remove_white_bg("assets/images/logo_icon.png", "assets/images/logo_transparent.png", tolerance=230)
