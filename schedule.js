

var listParam = [];
listParam.push( {
    spName: 'spInductionStepGetByLevelAndInduction',
    key : 'projId',
    value : 1,
    dataType: 'int'
})





$.ajax({
    url: 'http://prp-api.vercel.app/schedule',
    type: 'GET',
    headers : {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0', 'origin': 'http://prp.phf.gop.pk/', 'contentType' : 'application/x-www-form-urlencoded; charset=UTF-8'},
    
    dataType : 'json',
    success: function (response) {
        console.log(response);
    },
    error: function () {
        alert("error");
    }
}); 