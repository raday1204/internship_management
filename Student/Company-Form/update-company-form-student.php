<?php
include('../../database.php');

if (isset($_POST["username"])) {
    $username = $_POST["username"];

    // Get data from the POST request
    $student_code = $_POST['student_code'];
    $student_name = $_POST['student_name'];
    $student_lastname = $_POST['student_lastname'];
    $depart_name = $_POST['depart_name'];
    $student_pak = $_POST['student_pak'];
    $student_mobile = $_POST['student_mobile'];
    $student_facebook = $_POST['student_facebook'];

    // Update student profile data
    $updateSql = "UPDATE student 
    LEFT JOIN depart ON student.depart_code = depart.depart_code
    SET
                student_code = '$student_code',
                student_name = '$student_name',
                student_lastname = '$student_lastname',
                depart_name = '$depart_name',
                student_pak = '$student_pak',
                student_mobile = '$student_mobile',
                student_facebook = '$student_facebook'
                WHERE student_code = ?";

    // Use a prepared statement to prevent SQL injection
    $stmt = $conn->prepare($updateSql);

    if ($stmt === FALSE) {
        $response = array('success' => false, 'message' => 'Error preparing update statement');
    } else {
        $stmt->bind_param("s", $username);

        if ($stmt->execute()) {
            $response = array('success' => true, 'message' => 'Student profile updated successfully');

            // Fetch the updated data and send it back if needed
            $selectSql = "SELECT users.username, student.*, depart.depart_name
                FROM users 
                LEFT JOIN student ON users.username = student.student_code 
                LEFT JOIN depart ON student.depart_code = depart.depart_code
                WHERE student.student_code = ?";

            $stmtSelect = $conn->prepare($selectSql);
            $stmtSelect->bind_param("s", $username);

            if ($stmtSelect->execute()) {
                $result = $stmtSelect->get_result();

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $response['data'] = $row;
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Error fetching updated student profile data';
                }
            } else {
                $response['success'] = false;
                $response['message'] = 'Error executing select statement: ' . $stmtSelect->error;
            }

            $stmtSelect->close();
        } else {
            $response = array('success' => false, 'message' => 'Error updating student profile: ' . $stmt->error);
        }

        $stmt->close();
    }

    // Close the database connection
    $conn->close();

    // Send JSON response back to the Angular application
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Username not provided']);
}
