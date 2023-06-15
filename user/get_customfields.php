<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$userId = $content['userId'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();


$url = $baseUrl . '/api/v2/users/' . $userId; 
$buyer = callAPI("GET", $admin_token['access_token'], $url, false);  

foreach($buyer['CustomFields'] as $cf) { if ($cf['Name'] == 'video_embed' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
     $embed_cf = $cf['Values'][0];
     echo json_encode(['result' =>  $embed_cf]);
 }
}

?>
