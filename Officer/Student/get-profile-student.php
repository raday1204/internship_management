<?php
include('../../database.php');

if (isset($_GET["student_code"])) {
    $studentCode = $_GET["student_code"];

    $studentCode = $conn->real_escape_string($studentCode);

    // Use a prepared statement to avoid SQL injection
    $stmt = $conn->prepare("SELECT student_id, type_name, student_name, student_lastname, student_nickname, student_pic, student_citizen, student_email, student_mobile, student_facebook, student_line, st_address, st_tambol, st_ampher, st_province, st_zipcode, st_tel, st_contact, st_mobile, ct_address, ct_tambol, ct_ampher, ct_province, ct_zipcode, ct_tel, company_id FROM student WHERE student_code = ?");

    $stmt->bind_param("s", $studentCode);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $studentData = $result->fetch_assoc();

        // Get company data based on student_id
        $companyId = $studentData['company_id'];
        $companyStmt = $conn->prepare("SELECT * FROM company WHERE company_id = ?");
        $companyStmt->bind_param("i", $companyId);
        $companyStmt->execute();
        $companyResult = $companyStmt->get_result();

        if ($companyResult && $companyResult->num_rows === 1) {
            $companyData = $companyResult->fetch_assoc();
            $studentData['company_data'] = $companyData;
        }

        $basePath = '/PJ/Backend/Student/uploads/';
        $imagePath = $basePath . basename($studentData['student_pic']);

        $response = [
            'success' => true,
            'data' => $studentData, // Include all student data here
            'student_pic' => $imagePath,
        ];
        echo json_encode($response);
    } else {
        echo json_encode(array("error" => "No student data found for this user."));
    }

    $stmt->close();
    $companyStmt->close();
    $conn->close();
} else {
    echo json_encode(array("error" => "No student code provided."));
}
