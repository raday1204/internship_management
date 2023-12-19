<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$hostAuth = "localhost";
$userAuth = "root";
$passAuth = "";
$dbname = "internship_management";

$conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Assuming you're sending the company ID in the request
    $company_id = mysqli_real_escape_string($conn, $_POST['company_id']);

    // Assuming you're sending other fields in the request
    $send_name = mysqli_real_escape_string($conn, $_POST['send_name']);
    $send_coordinator = mysqli_real_escape_string($conn, $_POST['send_coordinator']);
    $send_position = mysqli_real_escape_string($conn, $_POST['send_position']);
    $send_tel = mysqli_real_escape_string($conn, $_POST['send_tel']);
    $send_email = mysqli_real_escape_string($conn, $_POST['send_email']);
    $send_mobile = mysqli_real_escape_string($conn, $_POST['send_mobile']);
    $company_job = mysqli_real_escape_string($conn, $_POST['company_job']);
    $number_student_train = (int)$_POST['number_student_train'];  // Cast to integer
    $date_addtraining  = mysqli_real_escape_string($conn, $_POST['date_addtraining']) ? date('Y-m-d', strtotime($_POST['date_addtraining'])) : null;

    // Update query without updating company_name and company_building
    $sql = "UPDATE company 
            SET send_name = ?, send_coordinator = ?, send_position = ?, send_tel = ?, 
                send_email = ?, send_mobile = ?, company_job = ? 
            WHERE company_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssi", $send_name, $send_coordinator, $send_position, $send_tel, $send_email, $send_mobile, $company_job, $company_id);

    if ($stmt->execute()) {
        // Update need_student data
        $sql_need_student = "UPDATE need_student SET number_student_train = ?, date_addtraining = ? WHERE company_id = ?";
$stmt_need_student = $conn->prepare($sql_need_student);
$stmt_need_student->bind_param("isi", $number_student_train, $date_addtraining, $company_id);

        if ($stmt_need_student->execute()) {
            $response = array("success" => true, "message" => "Data updated successfully");
        } else {
            $response = array("success" => false, "message" => "Error updating need_student data: " . $conn->error);
        }
    } else {
        $response = array("success" => false, "message" => "Error updating company data: " . $conn->error);
    }

    echo json_encode($response);
    $stmt->close();
    $stmt_need_student->close();
} else {
    $response = array("success" => false, "message" => "Invalid request method");
    echo json_encode($response);
}

$conn->close();
?>