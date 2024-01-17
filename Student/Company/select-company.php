<?php
include('../../database.php');

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    // Handle preflight request (OPTIONS)
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->username) || !isset($data->company_id)) {
        http_response_code(400);
        echo json_encode(array("success" => false, "error" => "Invalid request data.", "requestData" => $data));
        exit();
    }

    $username = $data->username;
    $newCompanyID = $data->company_id;

    $conn->set_charset("utf8mb4");
    $username = $conn->real_escape_string($username);

    // Start a transaction
    $conn->begin_transaction();

    try {
        // Check if the student already exists
        $checkSql = "SELECT users.username, student.student_code, student.company_id, training.*
                     FROM users 
                     LEFT JOIN student ON users.username = student.student_code 
                     LEFT JOIN training ON training.student_code = student.student_code
                     WHERE student.student_code = ? FOR UPDATE";  // Lock the selected rows for update

        $stmt_check = $conn->prepare($checkSql);
        $stmt_check->bind_param("s", $username);
        $stmt_check->execute();
        $checkResult = $stmt_check->get_result();
        $stmt_check->close();

        if ($checkResult && $checkResult->num_rows > 0) {
            // Check if the username already exists in the training table
            $checkUsernameSql = "SELECT * FROM training WHERE student_code = ?";
            $stmt_check_username = $conn->prepare($checkUsernameSql);
            $stmt_check_username->bind_param("s", $username);
            $stmt_check_username->execute();
            $checkUsernameResult = $stmt_check_username->get_result();
            $stmt_check_username->close();

            if ($checkUsernameResult && $checkUsernameResult->num_rows == 0) {
                // If the student exists and username is not in the training table, insert the username
                $insertUsernameSql = "INSERT INTO training (student_code) VALUES (?)";
                $stmt_insert_username = $conn->prepare($insertUsernameSql);
                $stmt_insert_username->bind_param("s", $username);
                $stmt_insert_username->execute();
                $stmt_insert_username->close();
            }

            // Update the company_id and status
            $updateSql = "UPDATE student SET company_id = ? WHERE student_code = ?";
            $stmt_update = $conn->prepare($updateSql);
            $stmt_update->bind_param("ss", $newCompanyID, $username);
            $stmt_update->execute();
            $stmt_update->close();

            $updateStatusSql = "UPDATE training SET company_id = ?, company_status = '1' WHERE student_code = ?";
            $stmt_update_status = $conn->prepare($updateStatusSql);
            $stmt_update_status->bind_param("ss", $newCompanyID, $username);
            $stmt_update_status->execute();
            $stmt_update_status->close();

            $updateAssessmentStatusSql = "UPDATE training SET company_id = ?, assessment_status = '1' WHERE student_code = ?";
            $stmt_update_assessment_status = $conn->prepare($updateAssessmentStatusSql);
            $stmt_update_assessment_status->bind_param("ss", $newCompanyID, $username);
            $stmt_update_assessment_status->execute();
            $stmt_update_assessment_status->close();

            // Commit the transaction if all queries are successful
            $conn->commit();

            echo json_encode(array("success" => true, "message" => "Company ID, status, and username inserted/updated successfully"));
        } else {
            http_response_code(404);
            echo json_encode(array("success" => false, "error" => "Student not found for this user. username: $username"));
        }
    } catch (Exception $e) {
        // An error occurred, rollback the transaction
        $conn->rollback();

        http_response_code(500);
        echo json_encode(array("success" => false, "error" => "Transaction failed: " . $e->getMessage()));
    }

    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "error" => "Invalid request method."));
}
