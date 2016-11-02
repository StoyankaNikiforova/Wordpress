jQuery(document).ready(function($){
    
    
    var canvas_product = $('#playground');
    var container = $(canvas_product).parent();
    
    var productName='';
    var price ='';
    var productId = '';  

    var img_style = new Image();
    var img_base = new Image();
    
    var rotatePoductDegr = 0;
    var img_knob1 = new Image();
    var img_knob2 = new Image();
    var img_knob3 = new Image();
    var current_knob = new Image();
    
    var isDeleted1and3 = false;

    
    
    //Run function when browser resizes
    $(window).resize( respondCanvas );

    function respondCanvas(){ 
        canvas_product.attr('width', $(container).width() ); //max width
        canvas_product.attr('height', $(container).width() ); //max height       
    }

//    //Initial call 
    respondCanvas();
    
    var canvasSize = $(container).width();
    var canvasHalfSize = canvasSize/2;
  
    var orderAccesoires = 0;
    var isActive = false;
    var activeKnob = ''; 
    var knob_names = new Map();
     var height_base = 0;
    var width_base = 0;
    
    var countAccessoires = 0;
    var countDel = 0;
    var deletedKnobs = '';
    var ALERT_TITLE = "Oops!";
    var ALERT_BUTTON_TEXT = "Ok";
    
    var trash = new Image();
    var check = new Image();
    var icon_x = canvasSize * 0.9;
    var icon_y = canvasSize * 0.1;
    var path = "http://"+document.domain +'/wp-content/plugins/product-designer/images/';
  
            
    
    
if(document.getElementById) {
    window.alert = function(txt) {
        createCustomAlert(txt);
    }
}

function createCustomAlert(txt) {
    d = document;

    if(d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(ALERT_TITLE));

    msg = alertObj.appendChild(d.createElement("p"));
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }

    alertObj.style.display = "block";

}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}

       
   setTimeout(function() {
        $('.product-wrapper:first-child img').trigger('click');
    });
    
$(document).on('click', '.product-wrapper img', function () {
      

     knob_names = new Map();
     height_base = 0;
     width_base = 0;
    $('.product-wrapper img').removeClass("selected");
    $(this).addClass("selected");   
    
    countAccessoires = 0;
    orderAccesoires = 0;
    countDel = 0;
    rotatePoductDegr = 0;
    isActive = false;
    
    $('#playground').removeLayer('product_style');
    $('#playground').removeLayer('product-base');
     $('#playground').removeLayer('img_knob');
     
    for(var i = 1; i < 4 ;i++){
         $('#playground').removeLayer('img_knob'+i);
    }

   
        productId = this.id;
        $('#cart-button').empty();
        $('#cart-button').append('<input type="button" class="add-to-cart" value="Поръчай за изработка">');
        
        $.ajax(
                         {
                 type: 'POST',
                 url: woo_product_designer_ajax.woo_product_designer_ajaxurl,
                 data: {
                     action:'product_designer_get_products_styles_list_ajax', 
                     product_id: productId
                 },
                 dataType: "json",
                 success: function(data)
                                 {
                                     price = data[0];
                                     productName = data[1];
                                     $styles = data[2];                                                                 
                                    $(".styles-list").empty();
                                    $(".styles-list").append($styles);
                                    $(".product-name").empty();
                                    $(".product-name").append(productName);
                                    $(".product-price").empty();
                                    $(".product-price").val(price);                          
                                     
                                    $bgn = $(".product-syles-item:first-child").css('background-image');                                     
                                    $regPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
                                    $url = $regPattern.exec($bgn)[2];
                                     
                                    img_base.src = $url;
                                   
                                    var x, y;
                                    if((productName === 'Диадема')|| productName === 'Headband'){
                                      inactivate_icons();   
                                      rotatePoductDegr = 24;
                                      height_base = canvasSize;
                                      width_base = canvasSize;
                                      x = canvasHalfSize;
                                      y = canvasHalfSize;
                                      $(".accessoires-size").show();
                                    }else{
                                      $('#playground').removeLayer('trash');
                                      $('#playground').removeLayer('check');
                                      $(".accessoires-size").val('Medium');
                                      $(".accessoires-size").hide();
                                      $(".accessoires-size").trigger('change');
                                      height_base = canvasSize * 0.2;
                                      width_base = canvasSize * 0.33;
                                        x = canvasHalfSize + (canvasSize * 0.06);
                                        y = canvasHalfSize;
                                    }
                                     $('canvas#playground').addLayer({
                                          type: 'image',
                                          name: 'product-base',
                                          source: img_base,                                          
                                          draggable: false,
                                          x: x, y: y,
                                          width: width_base,
                                          opacity: 0,
                                          height: height_base,
                                           click: function(layer) {
                                            inactivate_icons();
                                            isActive = false;
                                            for(var i =1; i<=3; i++){
                                              $img = $(this).getLayer('img_knob'+i);
                                            $('#playground').animateLayer($img, {                       
                                                shadowColor: '#09d8f2',
                                                  shadowBlur: 0,
                                                  shadowX: 0, shadowY: 0
                                                     }, 50)
                                                 }
                                     },
                                        imageSmoothing : false
                                        }).drawLayers();
                                        
                                         $base =  $('#playground').getLayer('product-base');
                                            $('#playground').animateLayer($base,{
                                                opacity: 1,
                                            });
                                        setTimeout(function() {
                                                $('.product-syles-item:nth-child(2)').trigger('click');
                                            });
                                 }                           
                         });                         
                       
                         
    });
                                     
       
    $(document).on('click', '.product-syles-item', function () {
        $('.product-syles-item').removeClass("selected");
        $(this).addClass("selected");
        
        $product_id = this.id;
        
        var x,y;
         var height = 0;
         var width = 0; 
        
        $.ajax(
                {
                 type: 'POST',
                 url: woo_product_designer_ajax.woo_product_designer_ajaxurl,
                 data: {
                     action:'product_designer_get_product_style_ajax', 
                     product_id: $product_id
                 },
                 success: function(data)
                                 {  
                                     if((productName == "Шнола")||(productName == "Hair clip")||(productName == "Ластик за коса")||(productName == "Ponytail holder")){
                                         x = canvasHalfSize + (canvasSize * 0.06);
                                         y = canvasHalfSize;
                                     }else{  
                                         x = canvasHalfSize;
                                         y = canvasHalfSize;
                                     }
                                   img_style.src = data ;
                                   
                                    height= canvasSize*(img_style.height/465);
                                    width = canvasSize*(img_style.width/465);
                                $('#playground').addLayer({
                                      type: 'image',
                                      name: 'product_style',
                                      source: img_style,
                                      rotate: rotatePoductDegr,
                                      draggable: false,                                    
                                      x: x, y: y,
                                      width: width, height: height,
                                      imageSmoothing : false,
                                      click: function(layer) {
                                                 for(var i =1; i<=3; i++){                                
                                                    $img = $(this).getLayer('img_knob'+i);
                                                    $(this).animateLayer($img, {                       
                                                       shadowColor: '#09d8f2',
                                                       shadowBlur: 0,
                                                       shadowX: 0, shadowY: 0
                                                            },20) 
                                                        }
                                                        isActive = false;
                                            
                                        },
                                   
                                  }).drawLayers();
                                 
                              }                           
                         });      
                
    });  
           
                 
    $(document).on('click', '.full_knob', function () { 
        
        if((productName == "Шнола")||(productName == "Hair clip")||(productName == "Ластик за коса")||(productName == "Ponytail holder")){
            knob_names.delete('img_knob');
            current_knob.src = this.src ;  
            $knobX = $knobY = canvasHalfSize; 
            
            var height= canvasSize*(current_knob.height/465);
            var width = canvasSize*(current_knob.width/465);  
             
            var myRe = new RegExp(/Button_\d+_\d+.png/g);
            var knob_name = (this.src).match(myRe);
            
            knob_names.set('img_knob', knob_name.toString());
            $('#playground').removeLayer('img_knob');
            $('#playground').addLayer({
                      type: 'image',
                      name: 'img_knob',
                      source: current_knob.src,  
                      draggable: false,                   
                      x: $knobX , y: $knobY,
                       height: height,
                       width:width,
                      imageSmoothing : false,    
                    }).drawLayers();
        }else{        
        if (isActive) {      
                  
                activeKnob.sourse = this.src;                 
                  console.log(this.naturalWidth);
                 var myRe = new RegExp(/Button_\d+_\d+.png/g);
                 var knob_name = (this.src).match(myRe); 
                 knob_names.set(activeKnob.name, knob_name.toString());
             
                $('#playground').removeLayer(activeKnob.name);
                var height= canvasSize*(this.naturalHeight/465);
                var width = canvasSize*(this.naturalWidth/465); 
                $('#playground').addLayer({
                              type: 'image',
                              name: activeKnob.name,
                              source: activeKnob.sourse,  
                              draggable: true,
                              shadowColor: '#09d8f2',
                              shadowBlur: 10,
                              shadowX: 0, shadowY: 0,
                              rotate: rotatePoductDegr, 
                              width: width, height: height,
                              scale: 0.95,
                               x: activeKnob.x, y: activeKnob.y,
                             touchend:function(layer) {                                                                        
                                    $(this).animateLayer(layer, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 10,
                                             shadowX: 0, shadowY: 0
                                                }, 50);
                                    activeKnob = layer;
                                    for(var i =1; i<=3; i++){                                        
                                         $img = $(this).getLayer('img_knob'+i);
                                         if($img !== activeKnob){
                                       $(this).animateLayer($img, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 0,
                                             shadowX: 0, shadowY: 0
                                                }, 50)
                                            }
                                            }
                                    isActive = true;
                                    activate_icons();
                                },
                              click: function(layer) {                                                                        
                                    $(this).animateLayer(layer, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 10,
                                             shadowX: 0, shadowY: 0
                                                }, 50);
                                    activeKnob = layer;
                                    for(var i =1; i<=3; i++){                                        
                                         $img = $(this).getLayer('img_knob'+i);
                                         if($img !== activeKnob){
                                       $(this).animateLayer($img, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 0,
                                             shadowX: 0, shadowY: 0
                                                }, 50)
                                            }
                                            }
                                    isActive = true;
                                    activate_icons();
                                },
                         drag: function(layer) {
                         if(layer.x + layer.width/2 >this.width || layer.y + layer.height/2> this.height){
                            deleteKnob();
                            }
                    }
                }).drawLayers();
                    update_canvas();
                   
        } else{      
       countDel = 0;
       deletedKnobs ='';     
        
        if(countAccessoires < 3){
                    
            countAccessoires++;
            orderAccesoires++;
            if (isDeleted1and3 === true && orderAccesoires === 2 ) {
                orderAccesoires = 3;
            }
            switch(orderAccesoires){
                case 1: 
                     $('#playground').removeLayer('img_knob1');
                   current_knob = img_knob1;                   
                   break;
                case 2:
                    $('#playground').removeLayer('img_knob2');
                    current_knob = img_knob2;                                
                    break;
                case 3:
                   $('#playground').removeLayer('img_knob3');
                   current_knob = img_knob3;
                    break; 
            }            
            
           
             current_knob.src = this.src ; 
             $knobX = $knobY = canvasHalfSize;
            var layer_name = 'img_knob'+ orderAccesoires;             
            var height= canvasSize*(current_knob.height/465);
            var width = canvasSize*(current_knob.width/465);  

            var myRe = new RegExp(/Button_\d+_\d+.png/g);
            var knob_name = (this.src).match(myRe); 
            knob_names.set(layer_name, knob_name.toString());
     
            $('#playground').addLayer({
                      type: 'image',
                      name: layer_name,
                      source: current_knob.src,  
                      draggable: true,
                      rotate: 24,                      
                      x: $knobX, y: $knobY,
                       height: height,
                       width:width,
                       scale:0.95,
                       touchend:function(layer) {                                                                        
                                    $(this).animateLayer(layer, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 10,
                                             shadowX: 0, shadowY: 0
                                                }, 50);
                                    activeKnob = layer;
                                    for(var i =1; i<=3; i++){                                        
                                         $img = $(this).getLayer('img_knob'+i);
                                         if($img !== activeKnob){
                                       $(this).animateLayer($img, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 0,
                                             shadowX: 0, shadowY: 0
                                                }, 50)
                                            }
                                            }
                                    isActive = true;
                                    activate_icons();
                                },
                      click: function(layer) {
                            $(this).animateLayer(layer, {                       
                                   shadowColor: '#09d8f2',
                                     shadowBlur: 10,
                                     bringToFront: true,
                                     shadowX: 0, shadowY: 0
                                        }, 50);
                            activeKnob = layer;
                            for(var i =1; i<=3; i++){                                        
                                    $img = $(this).getLayer('img_knob'+i);
                                    if($img !== activeKnob){
                                       $(this).animateLayer($img, {                       
                                           shadowColor: '#09d8f2',
                                             shadowBlur: 0,
                                             shadowX: 0, shadowY: 0
                                                }, 50)
                                      }
                            }
                            isActive = true;
                            activate_icons();

                        },
                         drag: function(layer) {
                         if(layer.x + layer.width/2 >this.width || layer.y + layer.height/2> this.height){
                            deleteKnob();
                            }
                        },
                         dragstop: function(layer) {
                          
                         },
                      imageSmoothing : false,    
                    }).drawLayers();                    
          
              update_canvas();
        }else{             
           createCustomAlert("Достигнахте максималния брой копчета за този продукт!!!");        
        }
      }  
    }
    });    
     
    $(document).on('click', '.add-to-cart', function () { 
                                var names ='';
                                $('#playground').removeLayer('trash');
                                $('#playground').removeLayer('check');
                                var canvas = document.getElementById("playground");
                                var $imgData = canvas.toDataURL("image/png");
                                var i = 1;
                                knob_names.forEach(function (value) {
                                                            names += i+ '. '+ value + "\n";
                                                            i++;
                                                         });

                                        $.ajax({
                                                type: "POST",
                                                url: woo_product_designer_ajax.woo_product_designer_ajaxurl,
                                                data:{
                                                    action:'product_designer_sent_product_to_cart_ajax',            
                                                    name: productName,
                                                    price: price, 
                                                    id:    productId,
                                                    knob_names: names,
                                                    imageURL: $imgData
                                                    
                                                },
                                                success: function(data)
                                                                 {
                                                                  location.reload();                                
                                                                 }                         

                                         });
                                     

});        
  
  
  function update_canvas(){
      
                   $('#playground').animateLayer('img_knob1',{
                        x:canvasHalfSize,
                       y:canvasHalfSize,
                    },300);
                    
                    var kn1 = $('#playground').getLayer('img_knob1');
                    var kn2 = $('#playground').getLayer('img_knob2');
                    var kn3 = $('#playground').getLayer('img_knob3');
                  
                    var hip = (kn1.height*0.95)/2 + (kn2.height*0.95)/2 ;
                   $knobX = canvasHalfSize + hip * Math.sin( 24 * Math.PI / 180.0) ;
                   $knobY = canvasHalfSize - hip * Math.sin(66 * Math.PI / 180.0) ;
                    $('#playground').animateLayer('img_knob2',{
                        x:$knobX,
                       y:$knobY,
                    },300)                   
                  
                   hip = (kn1.height*0.95)/2 + (kn3.height*0.95)/2 ;
                   $knobX = canvasHalfSize - hip * Math.sin( 24 * Math.PI / 180.0) ;
                   $knobY = canvasHalfSize + hip * Math.sin(66 * Math.PI / 180.0) ;
                    $('#playground').animateLayer('img_knob3',{
                        x:$knobX,
                       y:$knobY,
                    },300);
                   
  };
  
    function activate_icons(){
        $('#playground').removeLayer('trash');
        
                trash.src = path + 'trashcan_active.png';

                $('#playground').addLayer({
                  type: 'image',
                  name: 'trash',
                  source: trash,                                          
                  draggable: false,
                  x: icon_x, y: icon_x,
                  touchend: function (layer){
                      deleteKnob();
                      inactivate_icons();
                  },
                  click: function(layer) { 
                      inactivate_icons();                      
                      deleteKnob();
                 },
                imageSmoothing : false,
                }).drawLayers();

       $('#playground').removeLayer('check');
                                    check.src = path + 'check_active.png';

                                    $('#playground').addLayer({
                                      type: 'image',
                                      name: 'check',
                                      source: check,                                          
                                      draggable: false,
                                      x: icon_x, y: icon_y,
                                      touchend: function(layer) {
                                           incheckKnob();
                                     },
                                      click: function(layer) {
                                            inactivate_icons();
                                            isActive = false;
                                            for(var i =1; i<=3; i++){
                                              $img = $(this).getLayer('img_knob'+i);
                                            $('#playground').animateLayer($img, {                       
                                                shadowColor: '#09d8f2',
                                                  shadowBlur: 0,
                                                  shadowX: 0, shadowY: 0
                                                     }, 50)
                                                 }
                                     },
                                    imageSmoothing : false,
                                    }).drawLayers();
    }
    
    function inactivate_icons(){
        $('#playground').removeLayer('check');
                                    check.src = path + 'check_inactive.png';

                                    $('#playground').addLayer({
                                      type: 'image',
                                      name: 'check',
                                      source: check,                                          
                                      draggable: false,
                                      x: icon_x, y: icon_y,
                                    imageSmoothing : false,
                                    }).drawLayers();
                                    
        $('#playground').removeLayer('trash');
         trash.src = path + 'trashcan_inactive.png';
                                    $('#playground').addLayer({
                                      type: 'image',
                                      name: 'trash',
                                      source: trash,                                          
                                      draggable: false,
                                      x: icon_x, y: icon_x,
                                    imageSmoothing : false,
                                    }).drawLayers();
    }
    
    function deleteKnob(){
          $('#playground').removeLayer(activeKnob.name);
          inactivate_icons();
                        countAccessoires--;
                        countDel++;                                          
                           var numerReg = new RegExp(/\d+/g);
                           var layerNUmber = (activeKnob.name).match(numerReg)-0;
                             knob_names.delete(activeKnob.name);

                           deletedKnobs += layerNUmber;

                           switch(countDel){
                                 case 1:                     
                                        switch(layerNUmber){
                                                case 1:                     
                                                  orderAccesoires = 0;
                                                  isDeleted1and3 = true;
                                                    break;
                                                case 2:
                                                    orderAccesoires = 1;
                                                    break;
                                                case 3:
                                                   orderAccesoires = 2;
                                                    break; 
                                            }
                                            break;
                                 case 2:
                                        if (deletedKnobs==='12' || deletedKnobs==='21') {
                                                orderAccesoires = 0;
                                                isDeleted1and3 = false;

                                        }
                                        if (deletedKnobs==='32' || deletedKnobs==='23'){
                                        orderAccesoires = 1;
                                        isDeleted1and3 = false;

                                        } if (deletedKnobs==='31' || deletedKnobs==='13'){
                                           orderAccesoires = 0;
                                           isDeleted1and3 = true;

                                        }
                                     break;
                                 case 3:
                                     deletedKnobs ='';
                                    orderAccesoires = 0;

                                    isDeleted1and3 = false;
                                     break; 
              }                      
              isActive = false;
    }
    
    function incheckKnob(){
        
        inactivate_icons();
        isActive = false;
        for(var i =1; i<=3; i++){
          $img = $(this).getLayer('img_knob'+i);
        $('#playground').animateLayer($img, {                       
            shadowColor: '#09d8f2',
              shadowBlur: 0,
              shadowX: 0, shadowY: 0
                 }, 50)
             }
        
    }
      
})
                                 
    
      