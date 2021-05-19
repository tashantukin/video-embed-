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
 
  function sendEdm(content, merchantGuid, itemGuid)
  {
      var data = { 'itemguid': itemGuid, 'merchantguid': merchantGuid, 'notes': content};
      var apiUrl = packagePath + '/send_edm.php';
      $.ajax({
          url: apiUrl,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(response) {
            $('#note-to-seller').val('');
              //  toastr.success('Successfully saved.');
  
          },
          error: function(jqXHR, status, err) {
              //   toastr.error('---');
            //  callback();
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
      loadCustomField('settings',userId);
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
    //no check out
    if (pathname.indexOf('user/item/detail') >= 0) {
      //hide the add to cart buttons
      $('.add-cart-btn').hide();
      
      //hide the qty
      $('#itemDetailQty').hide();
      let orderInterestButton = `<a href="#" class="add-cart-btn" id="submit_order_interest">SUBMIT ORDER INTEREST</a>`;
      $('.item-qty-box').append(orderInterestButton);

      //hide the cart on header
      $('.cart_anchor').hide();

      //add pop up

      var interestModal =  `<div class="modal-overlay"></div> <div class="popup-area order-interest-popup">

      <div class="wrapper">
          <div class="order-interest-title">
              <h5>Submit Order Interest</h5>
              <a href="javascript:void(0)" onclick="cancel_remove()"><img src="images/closew_btn.svg"></a>
          </div>
          <div class="order-interest-view">
              <div class="form-group">
                  <label for="note-to-seller" >Note to seller</label>
                  <textarea rows="3" class="form-control" id="note-to-seller" name="note-to-seller"></textarea>
              </div>
          </div>
          
          <div class="btn-area-flex">
              <input type="button" id="cancel-request" value="Cancel" class="btn-cmn-outline">
              <input data-key="" data-id=""  type="button" value="Send" id="send-request" class="btn-cmn-theme">
          </div>
  
      </div>
  
  </div>
  <div id="cover">`
      
      $('.footer').after(interestModal);

      jQuery("#submit_order_interest").click(function(){
        show_conformation();
      });

      jQuery("#send-request").click(function ()
      {
        sendEdm($('#note-to-seller').val(), $('#merchantGuid').val(), $('#itemGuid').val())
        confirm_remove($(this));
      });

      jQuery("#cancel-request").click(function(){
        cancel_remove($(this))
      });



      function show_conformation(){
        var target =  jQuery(".popup-area.order-interest-popup");
        var cover = jQuery("#cover");
        target.fadeIn();
        cover.fadeIn();
    }
    
     function confirm_remove(ele) {
        var that = jQuery(ele);
            cancel_remove();
    }

    function cancel_remove(){
        var target =  jQuery(".popup-area.order-interest-popup");
        var cover = jQuery("#cover");
        target.fadeOut();
        cover.fadeOut();
        jQuery(".my-btn.btn-saffron").attr('data-id','');
        console.log("cancel remove item..");
    }
      

    }

  });
})();
