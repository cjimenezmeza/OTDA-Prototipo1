<?php
header('Content-Type: application/json');

// This is a mock function. In a real application, you would search your database.
function searchTesis($keywords, $category) {
    // Mock data
    $tesis = [
        ['titulo' => 'Impacto del turismo sostenible en Acapulco', 'autor' => 'Juan Pérez', 'resumen' => 'Este estudio analiza...', 'archivo' => 'uploads/tesis1.pdf', 'categoria' => 'turismo-sostenible'],
        ['titulo' => 'Estrategias de marketing para hoteles boutique', 'autor' => 'María González', 'resumen' => 'Esta investigación explora...', 'archivo' => 'uploads/tesis2.pdf', 'categoria' => 'marketing-turistico'],
    ];

    return array_filter($tesis, function($t) use ($keywords, $category) {
        $keywordMatch = empty($keywords) || stripos($t['titulo'], $keywords) !== false || stripos($t['resumen'], $keywords) !== false;
        $categoryMatch = empty($category) || $t['categoria'] === $category;
        return $keywordMatch && $categoryMatch;
    });
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $keywords = $_POST['busqueda'] ?? '';
    $category = $_POST['categoria'] ?? '';

    $results = searchTesis($keywords, $category);
    echo json_encode(array_values($results));
} else {
    echo json_encode(['error' => 'Método de solicitud no válido.']);
}