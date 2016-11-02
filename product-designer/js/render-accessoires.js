jQuery(document).ready(function($){
    
    setTimeout(function() {
        $('select').trigger('change');
    });
    
    $(document).on('change','select',function(){
     
        
                var size = $('.accessoires-size').val();
                var color = $('.accessoires-color').val();
         

             $.ajax(
                         {
                 type: 'POST',
                 url: woo_product_designer_ajax.woo_product_designer_ajaxurl,
                 data: {
                     action:'product_designer_get_accessoires_list_by_cat', 
                     size: size,
                     color: color
                 },
                 success: function(data)
                                 {
                                    $(".accessoires").empty();
                                    $(".accessoires").append(data);                                      
                                 }
                         });               
		
	});
        
        
   
});
    

 

