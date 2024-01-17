<?php
include('../../database.php');

if (isset($_SESSION["username"]) || isset($_GET["username"])) {

    $username = isset($_SESSION["username"]) ? $_SESSION["username"] : $_GET["username"];

    $username = $conn->real_escape_string($username);

    $sql = "SELECT users.username, student.* 
            FROM users 
            LEFT JOIN student ON users.username = student.student_code 
            WHERE student.student_code = '$username'";

    $result = $conn->query($sql);

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

        // Assuming 'student_pic' is a column in your table
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

    mysqli_close($conn);
} else {
    echo json_encode(array("error" => "No username provided."));
}
