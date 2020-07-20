<?php 

$config = yaml_parse_file('../config.yml');

if(!isset($_GET['payload'])) {
    exit;
}
$response = new stdClass();
$payload = json_decode($_GET['payload']);
if($payload->config->secret == $config['secret']) {
    if(file_exists('data.json')) {
        $data = json_decode(file_get_contents('data.json'));
    } else {
        $data = [];
    }
    foreach($payload->items as $item) {
        $data[] = $item;
    }
    file_put_contents('data.json', json_encode($data));
    $response->ok = "ok";
} else {
    $response->error = 'Secret mismatch';
}
print json_encode($response);