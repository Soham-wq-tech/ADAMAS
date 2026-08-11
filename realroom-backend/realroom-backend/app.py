from flask import Flask, jsonify, request
from dotenv import load_dotenv
load_dotenv()
from config import Config
from extensions import db, jwt, cors

from routes.auth import auth_bp
from routes.interview import interview_bp
from routes.dashboard import dashboard_bp

# Import your Gemini chat response helper function
from services.ai_interviewer import get_ai_response  # Update with your actual module name/path


def create_app():
    app = Flask(__name__)
    
    # Load configuration from config.py
    app.config.from_object(Config)

    # Initialize Flask Extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # Register Route Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(interview_bp)
    app.register_blueprint(dashboard_bp)

    # Root & Health Check Endpoints
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"status": "Flask API backend is running!"}), 200

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    # ---- NEW: Interview Chat Loop Handler Route --------------------------
    @app.route("/api/interview/response", methods=["POST"])
    def handle_interview_response():
        """
        Receives conversation history from the Next.js frontend and 
        returns the next AI response from Gemini while preserving context.
        """
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "Invalid JSON payload"}), 400

            company = data.get("company", "Google")
            interview_type = data.get("type", "Technical")
            mood = data.get("mood", "Professional")
            history = data.get("history", [])

            # Call the helper function that formats history for the Gemini API
            reply_text = get_ai_response(company, interview_type, mood, history)
            
            return jsonify({"reply": reply_text}), 200
        except Exception as e:
            app.logger.error(f"Error handling interview response: {e}")
            return jsonify({"error": str(e)}), 500

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found."}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error."}), 500

    # Create MySQL database tables if they do not exist
    with app.app_context():
        db.create_all()

    return app


# Create the application instance
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)