export const commonFunctions = {
    methods: {
        // date
        getCurrentDateText (type, sep) {
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            if( month.toString().length == 1 )
                month = `0${month}`;
            var date = today.getDate();
            if( date.toString().length == 1 )
                date = `0${date}`;
            
            var dateText = '';
            switch( type )
            {
                case 1: // yyyy-mm-dd
                    dateText = `${year}${sep}${month}${sep}${date}`;
                    break;
                case 2: // yyyy-mm
                    dateText = `${year}${sep}${month}`;
                    break;
            }
            return dateText;
        },
        // ajax    
        ajaxPOST: function (targetUrl, parameter, callback) {
            const self = this;    
    
            $.ajax({ 
            type: "POST", 
            url: targetUrl,                            
            data: {data: typeof(parameter) !== "string"? JSON.stringify(parameter) : parameter},
            dataType: "json",
            cache: false,
            // contentType: false,
            // processData: false,
            beforeSend: function() {
                // start loading spinner
                //self.apiLoading = true;
            },
            success: function(data, textStatus, jqXHR)
            { 
                if( data ){            
                callback(data);            
                }                    
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                // Handle errors here
                console.log('ERRORS: ' + textStatus); 
            },
            complete: function(e){
                // end loading spinner
                setTimeout(() => {
                //self.apiLoading = false;
                }, 500); 
            }
            });
        }
    }
}