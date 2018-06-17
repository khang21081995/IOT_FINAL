function callAjax(jsonStringSend, urlReciver, methodSend, completeCallback, errorCallBack, successCallBack, isAsync) {
    var data = jsonStringSend;
    $.ajax({
        url: urlReciver,
        method: methodSend,
        contentType: "application/json",
        data: data,
        async: isAsync || true,
        success: function (result, status, xhr) {
            successCallBack(result, status, xhr);
        },
        error: function (xhr, status, error) {
            errorCallBack(xhr, status, error);
        },
        complete: function (xhr, status) {
            completeCallback(xhr, status);
        }
    });
}
