from flask import Flask, render_template, jsonify, send_from_directory
import os

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')

# Directory where your .txt files are stored
POSTS_DIRECTORY = 'ExamplePosts'

@app.route('/')
def index():
    """Serve the index.html file."""
    return render_template('index.html')

@app.route('/catalogue')
def catalogue():
    """Serve the catalogue.html file."""
    return render_template('catalogue.html')

@app.route('/posts')
def list_posts():
    """
    Endpoint to list all .txt files in the ExamplePosts directory.
    This could be extended to include metadata for categorization if needed.
    """
    posts = [f for f in os.listdir(POSTS_DIRECTORY) if f.endswith('.txt')]
    return jsonify(posts)

@app.route('/posts/<filename>')
def get_post(filename):
    """
    Endpoint to serve individual .txt file content.
    Ensure proper handling of non-existent files or directory traversal attacks.
    """
    # Validate filename to prevent directory traversal
    if not filename.endswith('.txt') or '..' in filename or '/' in filename:
        return "Invalid file name.", 400
    # Serve the file if valid
    return send_from_directory(POSTS_DIRECTORY, filename)

if __name__ == '__main__':
    app.run(debug=True)