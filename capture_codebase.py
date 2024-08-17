import os
import argparse
import logging
from pathlib import Path

# Define relevant file extensions and directories to exclude
RELEVANT_EXTENSIONS = ('.ts', '.tsx', '.js', '.jsx', '.py', '.html', '.css')
EXCLUDED_DIRS = ('node_modules', '.git', '__pycache__', 'venv', 'env')

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description='Capture codebase structure and content.')
    parser.add_argument('-o', '--output', default='codebase_capture.txt', help='Output file name')
    parser.add_argument('-r', '--root', default='.', help='Root directory of the project')
    return parser.parse_args()

def is_relevant_file(file_path):
    """Check if the file is relevant based on its extension."""
    return file_path.suffix.lower() in RELEVANT_EXTENSIONS

def write_file_tree(file, path, prefix=''):
    """Write the file tree structure to the output file."""
    entries = sorted(os.scandir(path), key=lambda e: e.name)
    for i, entry in enumerate(entries):
        is_last = i == len(entries) - 1
        current_prefix = prefix + ('└── ' if is_last else '├── ')
        file.write(f"{current_prefix}{entry.name}\n")
        if entry.is_dir() and entry.name not in EXCLUDED_DIRS:
            next_prefix = prefix + ('    ' if is_last else '│   ')
            write_file_tree(file, entry.path, next_prefix)

def write_file_contents(file, path):
    """Write the contents of relevant files to the output file."""
    for root, _, files in os.walk(path):
        for filename in files:
            file_path = Path(root) / filename
            if is_relevant_file(file_path) and not any(excluded in file_path.parts for excluded in EXCLUDED_DIRS):
                file.write(f"\n\n{'='*80}\n")
                file.write(f"File: {file_path}\n")
                file.write(f"{'='*80}\n\n")
                try:
                    with open(file_path, 'r', encoding='utf-8') as source_file:
                        file.write(source_file.read())
                except Exception as e:
                    file.write(f"Error reading file: {e}\n")

def main():
    """Main function to capture codebase structure and content."""
    args = parse_arguments()
    root_dir = Path(args.root).resolve()
    output_file = Path(args.output)

    logging.info(f"Starting codebase capture from {root_dir}")
    logging.info(f"Output will be written to {output_file}")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("Codebase Structure:\n\n")
        write_file_tree(f, root_dir)
        
        f.write("\n\nFile Contents:\n")
        write_file_contents(f, root_dir)

    logging.info("Codebase capture completed successfully")

if __name__ == "__main__":
    main()