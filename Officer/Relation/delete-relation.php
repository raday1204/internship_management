<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $relationId  = isset($_GET['id']) ? $_GET['id'] : null;

    if ($relationId  === null) {
        echo json_encode(['success' => false, 'message' => 'Invalid ID']);
        exit;
    }

    $delete_query = "DELETE FROM relation WHERE id = $relationId ";

    if ($conn->query($delete_query) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Relation deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting relation: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
