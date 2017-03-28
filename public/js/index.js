$(document).ready(function(){
  $('.btn').click(function(){
    var url = $("#url-field").val();
    
    if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
}
    $.ajax({
    url: 'api/tiny',
    type: 'POST',
    dataType: 'JSON',
    data: {url: url},
                            success: function(data){
    var resultHTML = '<a href="' + data.shortUrl + '">' + data.shortUrl + '</a>';
    $('#link').html(resultHTML);
  }
 
                            
  })
  })})
