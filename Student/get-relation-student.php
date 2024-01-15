<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

$hostAuth = "localhost";
$userAuth = "root";
$passAuth = "";
$dbname = "internship_management";

$conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;

    $offset = ($page - 1) * $limit;

    $select_query = "SELECT * FROM relation ORDER BY relation_date DESC LIMIT ?, ?";
    $stmt = $conn->prepare($select_query);
    $stmt->bind_param('ii', $offset, $limit);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result === false) {
        echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $conn->error]);
        exit();
    }

    $relations = [];
    while ($row = $result->fetch_assoc()) {
        $relations[] = [
            'id' => $row['id'],
            'relation_date' => $row['relation_date'],
            'relation_content' => $row['relation_content']
        ];
    }

    echo json_encode(['success' => true, 'data' => $relations]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
