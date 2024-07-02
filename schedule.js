

var listParam = [];
listParam.push( {
    spName: 'spInductionStepGetByLevelAndInduction',
    key : 'projId',
    value : 1,
    dataType: 'int'
})





$.ajax({
    url: 'https://prp-api.vercel.app/schedule',
    type: 'GET',
   
    dataType : 'json',
    success: function (response) {
        console.log(response);
    },
    error: function () {
        console.log('error')
    }
}); 
