<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $relationId = $_GET['id'];

    // Use prepared statement to avoid SQL injection
    $select_query = "SELECT * FROM relation WHERE id = ?";
    $stmt = $conn->prepare($select_query);

    $stmt->bind_param("i", $relationId);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result === false) {
        echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $conn->error]);
        exit();
    }

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $basePath = '/PJ/Backend/Officer/uploads/';
        $file = $basePath . basename($row['relation_pic']);
        $fileExtension = pathinfo($file, PATHINFO_EXTENSION);

        $response = [
            'success' => true,
            'data' => [
                'id' => $row['id'],
                'relation_date' => $row['relation_date'],
                'relation_content' => $row['relation_content'],
                'relation_pic' => $file,
                'file_extension' => $fileExtension,
            ]
        ];

        echo json_encode($response);
    } else {
        echo json_encode(['success' => false, 'message' => 'Relation not found']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
