(function () {
  /* globals $ */
  var scriptSrc = document.currentScript.src;
  var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
  var packageId = re.exec(scriptSrc.toLowerCase())[1];
  var packagePath = scriptSrc.replace("/scripts/scripts.js", "").trim();
  var customFieldPrefix = packageId.replace(/-/g, "");
  const HOST = window.location.host;
  var hostname = window.location.hostname;
  var urls = window.location.href.toLowerCase();
  var userId = $("#userGuid").val();
  var merchantId = $('#storefrontMerchantGuid').val()
  var followerList = [];
  var currentUser = $('#subAccountUserGuid').length ? $('#subAccountUserGuid').val() : userId;
  var currentMerchant = $('#storefrontMerchantGuid').length ? $('#storefrontMerchantGuid').val() : $('#merchantGuid').val();
  var pathname = (window.location.pathname + window.location.search).toLowerCase();
  function waitForElement(elementPath, callBack) {
    window.setTimeout(function () {
      if ($(elementPath).length) {
        callBack(elementPath, $(elementPath));
      } else {
        waitForElement(elementPath, callBack);
      }
    }, 500);
  }
  function saveCustomFields(embed)
	{
		var data = { 'embed' : embed };
		//console.log(data);
		var apiUrl = packagePath + '/save_customfields.php';
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response)
			{

				//  toastr.success('Successfully saved.');

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('---');
			}
		});
	}
 

  function loadCustomField(page, userGuid)
	{
	
    var apiUrl = packagePath + '/get_customfields.php';
    var data = { 'userId': userGuid };
		$.ajax({
			url: apiUrl,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (result)
      {
        console.log(JSON.stringify(result));
				var embedCustomfield = $.parseJSON(result);
				var embedContent = embedCustomfield != null ? embedCustomfield.result : '';
        $('#embed').val(embedContent);


        if (page == 'storefront') {
          let videoDiv = `<div class='store-location-box pull-right' id='video-embed'> ${embedContent} </div>`;
          $('.store-location-box').before(videoDiv);

        } 

			},
			error: function (jqXHR, status, err)
			{
				// toastr.error('Error!');
			}
		});
	}
  $(document).ready(function ()
  {

    if (pathname.indexOf('/user/marketplace/seller-settings') > -1 || pathname.indexOf('/user/marketplace/be-seller') > -1 ) {
      loadCustomField('settings');
      var embedVideoDiv = `<div class='item-form-group'><div class='col-md-6 gutter-30'><label>Embed Video</label><textarea id='embed' value='' style="width:100%"></textarea></div><div class='clearfix'></div></div>`;
      $("#input-displayName").parents(".item-form-group").after(embedVideoDiv);


      $('body').on('click', '#payment_acceptance #next-tab', function ()
			{

        if ($("#embed").val()) {
          var embedContent = $("#embed").val();
          saveCustomFields(embedContent);


          
        }
			
			});

    }
    
    if (pathname.indexOf('user/merchantaccount') >= 0) {

      loadCustomField('storefront', $('#storefrontMerchantGuid').val());

     
    }

   

    // getMarketplaceCustomFields(function (result) {
    //   $.each(result, function (index, cf) {
    //     if (cf.Name == "Delete Cart" && cf.Code.startsWith(customFieldPrefix)) {
    //       code = cf.Code;
    //       pluginStatus = cf.Values[0];
    //       console.log(pluginStatus);
    //       if (pluginStatus == "true") { 
    //         if (userId) {
    //           $(".header .main-nav ul .cart-menu .cart-item-counter").append(
    //             '<span class="cart-delete-item"></li>'
    //           );
    //           var imgLink =
    //             "http://" +
    //             hostname +
    //             "/user/plugins/" +
    //             packageId +
    //             "/images/delete.svg";
    //           var img = document.createElement("img");
    //           img.src = imgLink;
    //           $(".header .main-nav ul .cart-delete-item").append(img);
    //           $(".cart-delete-item img").addClass("delete");
    //           $(".cart-menu .cart_anchor").append($(".cart-delete-item"));
    //         }
    //       }
    //     }
    //   });
    // });

  });
})();
