#!/usr/bin/env python3
from typing import List
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.absolute()
OUTPUT = PROJECT_ROOT.joinpath("build")


def main() -> None:
    # Delete the output folder.
    # Otherwise it might interfere when searching for files later
    shutil.rmtree(OUTPUT, ignore_errors=True)

    files = find_html_files()
    update_templates(files)
    create_build_output(files)


def find_html_files() -> List[Path]:
    """
    Return all files ending in .html except the ones in the templates folder.
    """
    files = []
    for path in PROJECT_ROOT.glob("**/*.html"):
        if path.parent.name == "templates":
            continue
        files.append(path)

    return files


def update_templates(files: List[Path]) -> None:
    templates = {}

    # Find all available templates
    for filepath in PROJECT_ROOT.glob("templates/*.html"):
        path = Path(filepath)
        # Get filename without suffix
        template_name = path.with_suffix("").name
        with path.open("rt") as f:
            template_content = f.read()
        templates[template_name] = template_content

    for file in files:
        with file.open("r+") as f:
            content = f.read()
            for tpl_name, tpl in templates.items():
                start = f"<!-- TEMPLATE {tpl_name.upper()} START -->"
                end = f"<!-- TEMPLATE {tpl_name.upper()} END -->"

                offset = 0
                while True:
                    offset = content.find(start, offset)
                    if offset == -1:
                        break
                    offset += len(start)
                    end_offset = content.find(end, offset)
                    if end_offset != -1:
                        content = content[:offset] + "\n" + tpl + content[end_offset:]

            f.seek(0)
            f.write(content)
            # Strip remaining content from the file
            f.truncate()


def create_build_output(html_files: List[Path]) -> None:
    OUTPUT.mkdir()
    for folder in ["css", "images"]:
        shutil.copytree(PROJECT_ROOT.joinpath(folder), OUTPUT.joinpath(folder))
    # Copy HTML files
    for html_file in html_files:
        output_html_file = OUTPUT.joinpath(html_file.relative_to(PROJECT_ROOT))
        # Ensure the folder exists
        output_html_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(html_file, output_html_file)


if __name__ == "__main__":
    main()
