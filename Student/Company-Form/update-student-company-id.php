<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Decode raw JSON data from the request
$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $company_id = $_POST['company_id'];
    $type_name = $_POST['type_name'];
    $username = $_POST['username'];

    // This is an update operation
    $sql_update_student = "UPDATE student SET company_id = ?, type_name = ? WHERE student_code = ?";
    $stmt_update_student = $conn->prepare($sql_update_student);

    if ($stmt_update_student === false) {
        die(json_encode(array("success" => false, "message" => "Prepare failed: " . $conn->error)));
    }

    $stmt_update_student->bind_param("iss", $company_id, $type_name, $username);

    if ($stmt_update_student->execute()) {
        $response_update_student = array("success" => true, "message" => "Student data updated successfully");

        // Add the SELECT query to retrieve additional information
        $selectSql = "SELECT users.username, student.*
                      FROM users
                      LEFT JOIN student ON users.username = student.student_code
                      WHERE student.student_code = ?";

        $stmt_select_student = $conn->prepare($selectSql);

        if ($stmt_select_student === false) {
            die(json_encode(array("success" => false, "message" => "Prepare failed: " . $conn->error)));
        }

        $stmt_select_student->bind_param("s", $username);
        $stmt_select_student->execute();

        $result = $stmt_select_student->get_result();

        if ($result && $result->num_rows > 0) {
            $data = $result->fetch_assoc();
            $response_update_student["data"] = $data;

            // Check if the username already exists in the training table
            $checkUsernameSql = "SELECT * FROM training WHERE student_code = ?";
            $stmt_check_username = $conn->prepare($checkUsernameSql);
            $stmt_check_username->bind_param("s", $username);
            $stmt_check_username->execute();
            $checkUsernameResult = $stmt_check_username->get_result();

            if ($checkUsernameResult && $checkUsernameResult->num_rows == 0) {
                // If the student exists and username is not in the training table, insert the username
                $insertUsernameSql = "INSERT INTO training (student_code) VALUES (?)";
                $stmt_insert_username = $conn->prepare($insertUsernameSql);
                $stmt_insert_username->bind_param("s", $username);
                $stmt_insert_username->execute();
                $stmt_insert_username->close();
            }

            // Update the training table with secure parameterized queries
            $updateStatusSql = "UPDATE training SET company_id = ?, company_status = '1' WHERE student_code = ?";
            $stmt_update_status = $conn->prepare($updateStatusSql);
            $stmt_update_status->bind_param("is", $company_id, $username);
            $stmt_update_status->execute();
            $stmt_update_status->close();

            $updateAssessmentStatusSql = "UPDATE training SET company_id = ?, assessment_status = '1' WHERE student_code = ?";
            $stmt_update_assessment_status = $conn->prepare($updateAssessmentStatusSql);
            $stmt_update_assessment_status->bind_param("is", $company_id, $username);
            $stmt_update_assessment_status->execute();
            $stmt_update_assessment_status->close();
        } else {
            $response_update_student["data"] = null;
        }

        $stmt_select_student->close();
    } else {
        $response_update_student = array("success" => false, "message" => "Error updating student data: " . $stmt_update_student->error);
    }

    $stmt_update_student->close();
    $conn->close();

    echo json_encode($response_update_student);
} else {
    $response_update_student = array("success" => false, "message" => "Invalid request method");
    echo json_encode($response_update_student);
}
