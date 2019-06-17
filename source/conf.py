project = "nkoep.net"
author = "Niklas Koep"
copyright = f"2019, {author}"

extensions = ["sphinx.ext.imgmath"]

templates_path = ['_templates']

exclude_patterns = ["_build"]

html_theme = "alabaster"
html_title = "nkoep.net"
html_static_path = ['_static']
html_sidebars = {}
html_domain_indices = True
html_show_sourcelink = False
html_show_sphinx = False
show_powered_by = False
html_show_copyright = False
html_add_permalinks = "#"

# imgmath extension options
imgmath_font_size = 14
imgmath_image_format = "svg"
imgmath_add_tooltips = False
imgmath_latex_preamble = "\\usepackage[boldvectors,boldmatrices]{blatex}"

def setup(app):
    app.add_stylesheet("css/style.css")
