<?php
include('../../database.php');

if (isset($_POST["username"])) {
    $username = $_POST["username"];

    $updateFields = array();

    // Process file upload
    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $file_name = $_FILES['file']['name'];
        $file_tmp = $_FILES['file']['tmp_name'];

        $upload_path = '/xampp/htdocs/PJ/Backend/Student/uploads/' . $file_name;
        if (move_uploaded_file($file_tmp, $upload_path)) {
            $updateFields[] = "student_pic = '$upload_path'";
        } else {
            echo json_encode(['success' => false, 'message' => 'Error moving uploaded file']);
            exit();
        }
    }

    // Process other fields
    $fieldsToUpdate = array(
        'type_name', 'student_name', 'student_lastname', 'student_nickname',
        'student_citizen', 'student_email', 'student_mobile', 'student_facebook',
        'student_line', 'st_address', 'st_tambol', 'st_ampher', 'st_province',
        'st_zipcode', 'st_tel', 'st_contact', 'st_mobile', 'ct_address', 'ct_tambol',
        'ct_ampher', 'ct_province', 'ct_zipcode', 'ct_tel'
    );

    foreach ($fieldsToUpdate as $field) {
        if (isset($_POST[$field])) {
            $fieldValue = $conn->real_escape_string($_POST[$field]);
            $updateFields[] = "$field = '$fieldValue'";
        }
    }

    // Update the database if there are fields to update
    if (!empty($updateFields)) {
        $updateSql = "UPDATE student SET " . implode(', ', $updateFields) . " WHERE student_code = '$username'";

        if ($conn->query($updateSql) === TRUE) {
            $response = ['success' => true, 'message' => 'Student profile updated successfully'];

            // Fetch the updated data and send it back if needed
            $selectSql = "SELECT users.username, student.* 
                FROM users 
                LEFT JOIN student ON users.username = student.student_code 
                WHERE student.student_code = '$username'";

            $result = $conn->query($selectSql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $response['data'] = $row;
            } else {
                $response['success'] = false;
                $response['message'] = 'Error fetching updated student profile data';
            }
        } else {
            $response = ['success' => false, 'message' => 'Error updating student profile: ' . $conn->error];
        }
    } else {
        $response = ['success' => false, 'message' => 'No fields to update'];
    }

    // Close the database connection
    $conn->close();

    // Send JSON response back to the Angular application
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Username not provided']);
}
