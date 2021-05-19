<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$merchantId = $content['merchantguid'];
$notes = $content['notes'];
$itemguid = $content['itemguid'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];
$admin_email =  $result['Email'];

$url = $baseUrl . '/api/v2/items/' . $itemId;
$item_details = callAPI("GET", null, $url, false);

$item_name = $item_details['Name'];
$item_currency = $item_details['CurrencyCode'];
$item_price = number_format((float)$item_details['Price'],2);
$item_sku = $item_details['SKU']; 
$item_seller_displayname = $item_details['MerchantDetail']['DisplayName'];
$item_image = $item_details['Media'][0]['MediaUrl'];

$url = $baseUrl . '/api/v2/users/' . $merchantId;
$merchant_details = callAPI("GET", null, $url, false);

//foreach($merchant_details['CustomFields'] as $cf) {
   // if ($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
     //   $followers_list = explode(",",$cf['Values'][0]); 

        // $followers = [];
      //  foreach($followers_list as $follower_id) {
           // get each item details  
         //  $url = $baseUrl . '/api/v2/users/' . $follower_id; 
         //  $result = callAPI("GET", null, $url, false);
       //    if($result['ID']) {

       //     $follower_email = $result['Email'];
                
            //send the EDM
            
                $subject = 'New order interest';
                $data = [
                    'From' => $user_email ,
                    'To' => $merchant_details['Email'],
                    'Cc' => $admin_email,
                    'Subject' => $subject,
                    'Body' =>  "<html> <body><div style=\"max-width:700px; width:100%; margin:0 auto; border:1px solid #ddd; color:#999; font-size:16px; font-family:sans-serif;  line-height:25px;\">

                    <div style=\"padding:15px;\">
                
                    <div style=\"text-align:center; margin-bottom:50px;\"> <img src=\"http://bootstrap.arcadier.com/marketplace/images/logo.png\" style=\"max-width:200px;\" /> </div>
                
                    <div>
                
                        <p style=\"color:#000; font-weight:bold; margin-bottom:50px;\">Hi Buyer / Seller name,</p>
                
                        <p>You have new item updates from <a href=\"javascript:void(0);\" style=\"color:#FF5A60; word-break:break-all; text-decoration:none; font-weight:bold;\"> $item_seller_displayname</a>.</p>
                        <h1>Notes: </h1>
                        <p> $notes </p>
                    </div>
                
                    <div style=\"border-bottom:1px solid #000; border-top:1px solid #000; padding-top: 10px; padding-bottom: 10px; margin-top:50px;\">
                
                
                    </div>
                
                    <div style=\"margin-top:30px;\">
                
                        <table  style=\"width:100%;\">
                
                        <tr>
                
                            <td style=\"vertical-align: top; width:20%; max-width:120px; min-width:33px;\"><img style=\"width:100%; max-width:120px;\" src= $item_image  /></td>
                
                            <td style=\"vertical-align: top; padding-left:5px;\"><div  style=\"line-height: 25px;\">
                
                                <p style=\"margin-top:0px; color:#000; line-height:22px;\">$item_name </p>
                
                            </div></td>
                
                            <td style=\"width:25%; max-width: 150px; text-align: right; vertical-align: top; padding-top: 20px; font-size: 22px; color: #000; font-weight: bold;\">$item_currency $item_price</td>
                
                        </tr>
                
                        </table>
                
                        <div style=\"border-bottom:1px solid #d2d2d2; margin-top:10px; margin-bottom:20px;\">&nbsp;</div>
                
                        
                
                        <div style=\"border-bottom:1px solid #d2d2d2; margin-top:10px; margin-bottom:20px;\">&nbsp;</div>
                
                    </div>
                
                    <div style=\"margin-top:30px;\">
                
                    
                    </div>
                
                    <div style=\"margin-bottom:50px;\">
                
                        <p>Regards,<br />
                
                        MarketplaceName</p>
                
                        <p><a style=\"color:#FF5A60; font-size:17px; font-weight:bold; text-decoration:none;\" href=\"http://www.arcadier.com\">www.marketplacename.arcadier.io</a></p>
                
                    </div>
                
                    </div>
                
                </div>
                </body>
                </html>"

                ];
                //error_log($data);
                $url =  $baseUrl . '/api/v2/admins/' . $admin_id .'/emails';
                $sendEDM = callAPI("POST", $admin_token['access_token'], $url, $data);
                echo json_encode(['result' => $sendEDM]);
                error_log(json_encode($sendEDM));

           
         //   }
      //  }
      
   // }
   
//}