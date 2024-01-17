<?php
include('../../database.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Assuming you're sending the company ID in the request
    $company_id = mysqli_real_escape_string($conn, $_POST['company_id']);

    // Assuming you're sending other fields in the request
    $send_name = isset($_POST['send_name']) ? mysqli_real_escape_string($conn, $_POST['send_name']) : null;
    $send_coordinator = isset($_POST['send_coordinator']) ? mysqli_real_escape_string($conn, $_POST['send_coordinator']) : null;
    $send_position = isset($_POST['send_position']) ? mysqli_real_escape_string($conn, $_POST['send_position']) : null;
    $send_tel = isset($_POST['send_tel']) ? mysqli_real_escape_string($conn, $_POST['send_tel']) : null;
    $send_email = isset($_POST['send_email']) ? mysqli_real_escape_string($conn, $_POST['send_email']) : null;
    $send_mobile = isset($_POST['send_mobile']) ? mysqli_real_escape_string($conn, $_POST['send_mobile']) : null;
    $company_job = isset($_POST['company_job']) ? mysqli_real_escape_string($conn, $_POST['company_job']) : null;
    $number_student_train = isset($_POST['number_student_train']) ? (int)$_POST['number_student_train'] : null;


    // Convert date strings to timestamps
    $date_addtraining = isset($_POST['date_addtraining']) ? $conn->real_escape_string($_POST['date_addtraining']) : "";
    $date_endtraining = isset($_POST['date_endtraining']) ? $conn->real_escape_string($_POST['date_endtraining']) : "";


    // Update query without updating company_name and company_building
    $sql = "UPDATE company 
            SET send_name = ?, send_coordinator = ?, send_position = ?, send_tel = ?, 
                send_email = ?, send_mobile = ?, company_job = ? 
            WHERE company_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssi", $send_name, $send_coordinator, $send_position, $send_tel, $send_email, $send_mobile, $company_job, $company_id);

    if ($stmt->execute()) {
        // Update need_student data
        $sql_need_student = "UPDATE need_student SET number_student_train = ?, date_addtraining = ?, date_endtraining = ? WHERE company_id = ?";
        $stmt_need_student = $conn->prepare($sql_need_student);
        $stmt_need_student->bind_param("issi", $number_student_train, $date_addtraining, $date_endtraining, $company_id);

        if ($stmt_need_student->execute()) {
            $response = array("success" => true, "message" => "Data updated successfully");
        } else {
            $response = array("success" => false, "message" => "Error updating need_student data: " . $stmt_need_student->error);
        }

        $stmt_need_student->close();
    } else {
        $response = array("success" => false, "message" => "Error updating company data: " . $stmt->error);
    }

    $stmt->close();
    echo json_encode($response);
} else {
    $response = array("success" => false, "message" => "Invalid request method");
    echo json_encode($response);
}

$conn->close();
