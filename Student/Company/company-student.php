<?php
include('../../database.php');

$sql = "SELECT company.company_id, company.company_name, company.company_building, 
student.student_code, student.student_name, student.student_lastname, need_student.number_student_train
FROM company
        LEFT JOIN student ON company.company_id = student.company_id
        LEFT JOIN need_student ON company.company_id = need_student.company_id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Convert the result to an associative array
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    // Fetch additional need_student information
    $response = array(
        'company' => $rows,
        'need_student' => array(),
        'student' => array(),
    );

    foreach ($rows as $row) {
        $companyId = $row['company_id'];

        if (!isset($response['need_student'][$companyId])) {
            $response['need_student'][$companyId] = array();
        }

        $response['need_student'][$companyId][] = array(
            'number_student_train' => $row['number_student_train'],
        );

        $response['student'][$companyId][] = array(
            'student_code' => $row['student_code'],
            'student_name' => $row['student_name'],
            'student_lastname' => $row['student_lastname']
        );
    }
    // Return the result as JSON
    echo json_encode($response);
} else {
    echo "No records found";
}

// Close the database connection
$conn->close();
