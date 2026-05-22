import sys
import os
import json
import time
from flask import Flask, request, jsonify, send_from_directory, session

app = Flask(__name__, static_folder='.')
app.secret_key = 'rms_multi_tech_secret_key_12345'  # For signed session cookies

DATA_FILE = 'data.json'

DEFAULT_STATE = {
    "hero": {
        "title": "Empowering Businesses with Dual-Engine Innovation",
        "subtitle": "We deliver customized high-performance engineering services and state-of-the-art SaaS products under one visionary leadership."
    },
    "about": {
        "title": "Who We Are",
        "desc": "A multi-task organization structured to provide high-quality services alongside custom products."
    },
    "servicesHeader": {
        "title": "Our Core Services",
        "desc": "Tailored technical solutions designed to scale your operations and drive digital growth."
    },
    "productsHeader": {
        "title": "Featured Products",
        "desc": "Innovative digital platforms engineered to streamline business administration and tasks."
    },
    "ceo": {
        "name": "Raja Meenakshi Sundaram G",
        "quote": "\"Innovation isn't just about build-quality; it's about solving the right problems with scalable, hybrid solutions. We bridge high-performance consultancy with cutting-edge software development to lead companies into the automation era.\"",
        "bio": "Raja Meenakshi Sundaram G is a visionary technology entrepreneur with deep experience in orchestrating modern, multi-task systems. By uniting both service-oriented technical workflows and modular products, he leads RMS MultiTech's mission to drive business transformation across global sectors.",
        "phone": "9043389303",
        "email": "rajalegand1114@gmail.com"
    },
    "contactHeader": {
        "title": "Let's Build Together",
        "desc": "Whether you have a query about our development services, wish to license one of our enterprise products, or want to discuss direct integration with our founder, our team is ready to assist."
    },
    "corporate": {
        "address": "5-24-57/12 Silon Colony North, Virudhunagar, Aruppukottai, Palayampattai",
        "phone": "+91 9043389303",
        "email": "rajalegand1114@gmail.com",
        "hours": "Mon - Fri, 9:00 AM - 6:00 PM IST"
    },
    "services": [
        {
            "title": "AI & Machine Learning Solutions",
            "icon": "cpu",
            "desc": "Deploy production-grade large language models, smart automation pipelines, and data-driven prediction algorithms tailored to your exact operations."
        },
        {
            "title": "Full-Stack Enterprise Engineering",
            "icon": "code",
            "desc": "Build highly reliable web applications, distributed APIs, and performant backend systems using state-of-the-art frameworks and practices."
        },
        {
            "title": "Cloud Infrastructure & DevOps",
            "icon": "cloud",
            "desc": "Accelerate your deployments with managed cloud setups (AWS/GCP), CI/CD pipelines, automated scaling, and enterprise security guardrails."
        }
    ],
    "products": [
        {
            "title": "RMS Workflow Hub",
            "tag": "SaaS",
            "desc": "An intuitive collaborative platform designed to orchestrate complex services and product pipelines under a single unified dashboard.",
            "link": "#"
        },
        {
            "title": "RMS Sentinel Security",
            "tag": "Compliance",
            "desc": "Continuous security audit engine that scans enterprise codebases for compliance, secret leaks, and dependency vulnerabilities.",
            "link": "#"
        },
        {
            "title": "RMS Analytics Engine",
            "tag": "Analytics",
            "desc": "Real-time metrics tracking and resource performance monitoring dashboard for cloud nodes and API latency.",
            "link": "#"
        }
    ]
}

# Load state from file or default
def load_state():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(DEFAULT_STATE, f, indent=4, ensure_ascii=False)
        return DEFAULT_STATE
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return DEFAULT_STATE

def save_state(state_data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(state_data, f, indent=4, ensure_ascii=False)

# Track heartbeat and active state
last_heartbeat = 0
admin_active = False

def check_heartbeat():
    global admin_active
    # If admin is active but no heartbeat received in last 25 seconds, deactivate
    if admin_active and (time.time() - last_heartbeat > 25):
        admin_active = False

@app.before_request
def before_request():
    check_heartbeat()

# Serve index.html or maintenance.html
@app.route('/')
@app.route('/index.html')
def index():
    check_heartbeat()
    # If admin is active, visitors (non-admins) see the maintenance page
    if admin_active:
        if not session.get('is_admin'):
            return send_from_directory('.', 'maintenance.html')
    return send_from_directory('.', 'index.html')

# Serve other static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# APIs
@app.route('/api/state', methods=['GET'])
def get_state():
    return jsonify(load_state())

@app.route('/api/state', methods=['POST'])
def update_state():
    if not session.get('is_admin'):
        return jsonify({"error": "Unauthorized"}), 403
    state_data = request.json
    save_state(state_data)
    return jsonify({"success": True})

@app.route('/api/login', methods=['POST'])
def login():
    global admin_active, last_heartbeat
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username == 'admin' and password == 'admin123':
        session['is_admin'] = True
        admin_active = True
        last_heartbeat = time.time()
        return jsonify({"success": True})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    global admin_active
    session.pop('is_admin', None)
    admin_active = False
    return jsonify({"success": True})

@app.route('/api/heartbeat', methods=['POST'])
def heartbeat():
    global last_heartbeat, admin_active
    if session.get('is_admin'):
        last_heartbeat = time.time()
        admin_active = True
        return jsonify({"status": "active"})
    return jsonify({"status": "unauthorized"}), 401

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "admin_active": admin_active,
        "is_admin": bool(session.get('is_admin'))
    })

if __name__ == '__main__':
    # Try port 80, fall back to 3000
    preferred_port = 80
    fallback_port = 3000
    try:
        print(f"Starting Flask server on port {preferred_port}...")
        # debug=False is important so it doesn't double-start due to reloader
        app.run(host='0.0.0.0', port=preferred_port, debug=False)
    except Exception as e:
        print(f"Failed to start on port {preferred_port}: {e}")
        print(f"Retrying on port {fallback_port}...")
        app.run(host='0.0.0.0', port=fallback_port, debug=False)
