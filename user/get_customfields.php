<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$invoice_number = $content['invoice_number'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];


$url = $baseUrl . '/api/v2/users/' . $userId; 
$buyer = callAPI("GET", $admin_token['access_token'], $url, false);  

foreach($buyer['CustomFields'] as $cf) { if ($cf['Name'] == 'video_embed' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
     $embed_cf = $cf['Values'][0];
     echo json_encode(['result' =>  $embed_cf]);
 }
}

?>
