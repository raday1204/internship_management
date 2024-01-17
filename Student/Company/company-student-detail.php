<?php
include('../../database.php');

if (isset($_GET['username'])) {
    $username = $_GET['username'];

    $sql = "SELECT company.company_id, company.company_name, company.company_building, 
            student.student_code, student.student_name, student.student_lastname, need_student.number_student_train
            FROM company
            LEFT JOIN student ON company.company_id = student.company_id
            LEFT JOIN need_student ON company.company_id = need_student.company_id
            WHERE student.company_id = (
                SELECT company_id
                FROM student
                WHERE student_code = '$username'
                LIMIT 1
            )";


    $result = $conn->query($sql);

    if ($result !== false) {
        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }

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

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        echo json_encode(array("success" => false, "error" => "Query error: " . $conn->error));
    }
} else {
    echo json_encode(array("success" => false, "error" => "Username parameter is missing"));
}

$conn->close();
