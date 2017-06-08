angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('mvNotifier', function(mvToastr) {
    mvToastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    notify = function(method, title, msg){
        switch(method){
            case 's': mvToastr.success(msg, title); break;
            case 'i': mvToastr.info(msg, title); break;
            case 'w': mvToastr.warning(msg, title); break;
            case 'e': mvToastr.error(msg, title); break;
        }
        console.log(msg);
    };
    return {
        successNotify: function(title, msg) {
            notify('s', title, msg);
        },
        infoNotify: function(title, msg) {
            notify('i', title, msg);
        },
        warningNotify: function(title, msg) {
            notify('w', title, msg);
        },
        errorNotify: function(title, msg) {
            notify('e', title, msg);
        }
    };
});