#!/usr/bin/env python3
from typing import List
from pathlib import Path
from glob import glob


def main() -> None:
    files = find_html_files()
    update_templates(files)


def find_html_files() -> List[Path]:
    """
    Return all files ending in .html except the ones in the templates folder
    """
    files = []
    for filepath in glob("../**/*.html", recursive=True):
        path = Path(filepath)
        if path.parent.name == "templates":
            continue
        files.append(path)

    return files


def update_templates(files: List[Path]) -> None:
    templates = {}

    # Find all available templates
    for filepath in glob("../templates/*.html"):
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


if __name__ == "__main__":
    main()
