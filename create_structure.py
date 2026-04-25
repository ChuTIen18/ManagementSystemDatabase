import os

# Base directory
base_dir = r"C:\Users\USER\OneDrive\Desktop\Everyhing_tosave\PussyU\datamanagementsystem"

# Directory structure
directories = [
    "src/main",
    "src/renderer/components",
    "src/renderer/pages",
    "src/renderer/styles",
    "src/renderer/hooks",
    "src/renderer/store",
    "src/renderer/utils",
    "src/preload",
    "src/api/controllers",
    "src/api/models",
    "src/api/routes",
    "src/api/middleware",
    "src/api/config",
    "src/api/services",
    "src/api/utils",
    "src/database/migrations",
    "src/database/seeders",
    "src/database/schemas",
    "src/shared/types",
    "src/shared/constants",
    "src/shared/utils",
    "public/assets/images",
    "public/assets/icons",
    "public/assets/fonts",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "scripts",
    "config",
    "logs",
]

# Create directories
for directory in directories:
    dir_path = os.path.join(base_dir, directory)
    os.makedirs(dir_path, exist_ok=True)
    # Create .gitkeep to preserve empty directories
    gitkeep_path = os.path.join(dir_path, ".gitkeep")
    with open(gitkeep_path, "w") as f:
        f.write("")
    print(f"Created: {directory}")

print(f"\n✓ Created {len(directories)} directories successfully!")
