<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$embed_video = $content['embed'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

// Query to get marketplace id

// https://{{your-marketplace}}.arcadier.io/api/v2/users/{{userID}}
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);
$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

foreach ($packageCustomFields as $cf) {
    
    if ($cf['Name'] == 'video_embed' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
        $embed_code = $cf['Code'];
    }

}

//if ($jobtitle) {
    $data = [
        'CustomFields' => [
            [
                'Code' => $embed_code,
                'Values' => [$embed_video],
            ],
        ],
    ];
    $id =  $marketplaceInfo['ID'];
    $url = $baseUrl . '/api/v2/users/' . $userId;
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);

//}



?>

