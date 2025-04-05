<?php 

include '../access/server.php';

include '../access/nodejs.php';

echo json_encode([
    'success' => true,
    'message' => 'Connected'
]);

?>