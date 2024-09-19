<?php
header('Content-Type: application/json');

// This is a mock function. In a real application, you would fetch this data from your database.
function getTesis() {
    return [
        ['titulo' => 'Impacto del turismo sostenible en Acapulco', 'autor' => 'Juan Pérez', 'resumen' => 'Este estudio analiza...', 'archivo' => 'uploads/tesis1.pdf'],
        ['titulo' => 'Estrategias de marketing para hoteles boutique', 'autor' => 'María González', 'resumen' => 'Esta investigación explora...', 'archivo' => 'uploads/tesis2.pdf'],
        ['titulo' => 'Gestión de crisis en la industria hotelera', 'autor' => 'Carlos Rodríguez', 'resumen' => 'Este trabajo examina...', 'archivo' => 'uploads/tesis3.pdf'],
    ];
}

echo json_encode(getTesis());