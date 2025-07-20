from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock database
users_db = {
    "user@example.com": {
        "password": "securepassword123",
        "name": "John Doe",
        "membership": "premium"
    }
}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email in users_db and users_db[email]['password'] == password:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "name": users_db[email]['name'],
                "email": email,
                "membership": users_db[email]['membership']
            }
        })
    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Received registration data:", data)  # Debug print
        
        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400
            
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({
                "success": False,
                "message": "Missing required fields (email, password, name)"
            }), 400
            
        if email in users_db:
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 400
            
        users_db[email] = {
            "password": password,
            "name": name,
            "membership": "basic"
        }
        
        print("New user registered:", email)  # Debug print
        
        return jsonify({
            "success": True,
            "message": "Registration successful!",
            "user": {
                "name": name,
                "email": email,
                "membership": "basic"
            }
        })
        
    except Exception as e:
        print("Registration error:", str(e))
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
