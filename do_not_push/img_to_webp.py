import os
from PIL import Image

def convert_to_webp(source_dir, target_dir):
    # Ensure target directory exists
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    # Supported formats
    supported_formats = ('.png', '.jpeg', '.jpg')

    # Iterate through files in source directory
    for filename in os.listdir(source_dir):
        if filename.lower().endswith(supported_formats):
            filepath = os.path.join(source_dir, filename)
            
            try:
                # Open the image
                with Image.open(filepath) as img:
                    # Construct target filename
                    target_filename = os.path.splitext(filename)[0] + '.webp'
                    target_filepath = os.path.join(target_dir, target_filename)
                    
                    # Convert and save as WEBP
                    img.save(target_filepath, 'WEBP')
                    print(f"Successfully converted: {filename} -> {target_filename}")
            except Exception as e:
                print(f"Error converting {filename}: {e}")

if __name__ == '__main__':
    source_directory = r'c:\Users\Eumelle\Desktop\GitHub Projects\quiz-bot\img'
    target_directory = r'c:\Users\Eumelle\Desktop\GitHub Projects\quiz-bot\webp'
    
    print(f"Starting conversion from {source_directory} to {target_directory}")
    convert_to_webp(source_directory, target_directory)
    print("Conversion process finished.")
