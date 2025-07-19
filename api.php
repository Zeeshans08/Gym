<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Mock database
$users = [
    "user@example.com" => [
        "password" => "securepassword123",
        "name" => "John Doe",
        "membership" => "premium"
    ]
];

$contacts = [];

$memberships = [
    [
        "id" => 1,
        "name" => "Basic",
        "price" => 29,
        "features" => [
            "Access to cardio area",
            "Limited gym hours (5AM-8PM)",
            "Locker room access",
            "1 free trainer consultation"
        ],
        "popular" => false
    ],
    [
        "id" => 2,
        "name" => "Premium",
        "price" => 49,
        "features" => [
            "Full gym access",
            "24/7 access",
            "Unlimited group classes",
            "2 free trainer sessions/month"
        ],
        "popular" => true
    ]
];

$input = json_decode(file_get_contents('php://input'), true);
$endpoint = $_GET['endpoint'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($endpoint) {
        case 'login':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            if (isset($users[$email]) && $users[$email]['password'] === $password) {
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "user" => [
                        "name" => $users[$email]['name'],
                        "email" => $email,
                        "membership" => $users[$email]['membership']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid email or password"
                ]);
            }
            break;
            
        case 'contact':
            $contacts[] = $input;
            echo json_encode([
                "success" => true,
                "message" => "Thank you for your message! We'll get back to you soon."
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Endpoint not found"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $endpoint === 'memberships') {
    echo json_encode([
        "success" => true,
        "memberships" => $memberships
    ]);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>