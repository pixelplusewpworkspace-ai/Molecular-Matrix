from PIL import Image
import os

files_to_convert = [
    r"use cases\usecase 05.png",
    r"use cases\use case 05 05.png"
]

for f in files_to_convert:
    if os.path.exists(f):
        img = Image.open(f)
        out_path = os.path.splitext(f)[0] + ".webp"
        img.save(out_path, "webp")
        print(f"Converted {f} to {out_path}")
        os.remove(f)
        print(f"Removed {f}")
    else:
        print(f"File not found: {f}")
