<?php
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titulo = $_POST['titulo'] ?? '';
    $autor = $_POST['autor'] ?? '';
    $resumen = $_POST['resumen'] ?? '';
    
    if (empty($titulo) || empty($autor) || empty($resumen)) {
        $response['message'] = 'Todos los campos son obligatorios.';
    } elseif (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
        $response['message'] = 'Hubo un problema con la carga del archivo.';
    } else {
        $uploadDir = 'uploads/';
        $fileName = uniqid() . '_' . basename($_FILES['archivo']['name']);
        $uploadFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['archivo']['tmp_name'], $uploadFile)) {
            // Here you would typically save the thesis information to a database
            // For this example, we'll just simulate a successful upload
            $response['success'] = true;
            $response['message'] = 'Tesis cargada con éxito.';
        } else {
            $response['message'] = 'Hubo un error al guardar el archivo.';
        }
    }
} else {
    $response['message'] = 'Método de solicitud no válido.';
}

echo json_encode($response);