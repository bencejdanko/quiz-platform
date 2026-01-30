Exporting MDs to PDFs:

```bash
pandoc {study_guides}.md --pdf-engine=weasyprint --css=study_guide.css   -o {study_guides}.pdf
```