<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($_SESSION["username"]) || isset($data["username"])) {
        $username = isset($_SESSION["username"]) ? $_SESSION["username"] : $data["username"];

        $username = $conn->real_escape_string($username);

        // Fetch user, company, and training information
        $sqlUser = "SELECT users.username, student.*
                    FROM users 
                    LEFT JOIN student ON users.username = student.student_code
                    WHERE users.username = '$username'";

        $resultUser = $conn->query($sqlUser);

        if ($resultUser && $resultUser->num_rows === 1) {
            $rowUser = $resultUser->fetch_assoc();

            // Fetch training information
            $sqlTraining = "SELECT *
                            FROM `training`
                            WHERE `student_code` = '$username'";

            $resultTraining = $conn->query($sqlTraining);

            $trainingData = [];
            if ($resultTraining) {
                while ($rowTraining = $resultTraining->fetch_assoc()) {
                    $trainingData[] = [
                        'company_status' => $rowTraining['company_status'],
                        'assessment_status' => $rowTraining['assessment_status'],
                    ];
                }
            }

            $response = [
                'success' => true,
                'data' => [
                    'trainingData' => $trainingData,
                ],
            ];
            echo json_encode($response);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'No user found.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No username provided.']);
    }
} else {
    // Unsupported HTTP method
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Unsupported HTTP method.']);
}

// Close the connection only if it's successfully opened
if ($conn) {
    $conn->close();
}
