<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $relationId = $_GET['id'];

    $updateFields = array();

    if (isset($_POST['relation_date'])) {
        $updateFields[] = "relation_date = '" . $_POST['relation_date'] . "'";
    }

    if (isset($_POST['relation_content'])) {
        $updateFields[] = "relation_content = '" . $_POST['relation_content'] . "'";
    }

    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $file_name = $_FILES['file']['name'];
        $file_tmp = $_FILES['file']['tmp_name'];

        $allowed_extensions = array('jpeg', 'jpg', 'png', 'pdf', 'doc');

        $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_extension, $allowed_extensions)) {
            $upload_path = '/xampp/htdocs/PJ/Backend/Officer/uploads/' . $file_name;

            if (move_uploaded_file($file_tmp, $upload_path)) {
                $updateFields[] = "relation_pic = '$upload_path'";
            } else {
                echo json_encode(['success' => false, 'message' => 'Error moving uploaded file']);
                exit();
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Unsupported file type']);
            exit();
        }
    }

    if (!empty($updateFields)) {
        $update_query = "UPDATE relation 
                         SET " . implode(", ", $updateFields) . "
                         WHERE id = $relationId";

        if ($conn->query($update_query) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Data updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating data: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
    }

    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$conn->close();
