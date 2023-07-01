function generateInputs(id,type){

    if(type =='status'){
        var item="select#"+id;
        const $statusList = $(item);

        $.each(st, function(index, item) {
            const option = $("<option></option>")
            .attr("value", item.sid)
            .text(item.title)
            $statusList.append(option);
        });}

    if(type =='camp'){
        var item="select#"+id;
        const $clidsList = $(item);

        $.each(camps, function(index, item) {
            const option = $("<option></option>")
            .attr("value", item.lids)
            .text(item.title)
            $clidsList.append(option);
        });
    }
    if(type =='label'){
        var item="div#"+id;
        const lblsList = $(item);

        $.each(lbl, function(index, item) {
            const option = "<input type=\"checkbox\" id=\"" +item.lid+ "\" name=\"label[]\" value=\"" +item.lid+ "\"> <label for=\"" +item.lid+ "\"> " +item.title+ "</label><br>";
            lblsList.append(option);
        });
    }

}
function GetStatusName(st, sid) {
    if(sid){

        let jsonData = st;

        // Find object with given sid and retrieve its title property
        let obj = $.grep(jsonData, function (item) {
            return item.sid === sid;
        })[0];
        let title = obj.title;

        return title;
    }
    else{return "null"}
    // Convert JSON string to JavaScript object

}
function GetLabelName(lbl, lid) {

    if(lid){let jsonData = lbl;

            // Find object with given sid and retrieve its title property
            let obj = $.grep(jsonData, function (item) {
                return item.lid === lid;
            })[0];
            let title = obj.title;

            return title;}
    else return "null"

}
function GetCampName(camps, lid) {

    if(lid){let jsonData = camps;

            // Find object with given sid and retrieve its title property
            let obj = $.grep(jsonData, function (item) {
                return item.lids === lid;
            })[0];
            let title = obj.title;

            return title;}
    else return "null"

}
function createListingTable() {

    $('#responsive-datatable').dataTable({
        lengthMenu: [50, 100, 500, 1000],
        pageLength: 50,
        drawCallback: function(settings) {
            var checkAll = $("#check-all");
            var checkboxes = $(".selectionbox");

            // Set the "check all" checkbox to trigger a change event when clicked
            checkAll.change(function() {
                checkboxes.prop("checked", checkAll.prop("checked"));
            });

            // Set the other checkboxes to trigger a change event when clicked
            checkboxes.change(function() {
                checkAll.prop("checked", checkboxes.not(":checked").length === 0);
            });

        },
        order: [
            [0, 'desc']
        ],
        processing: true,
        ajax: {
            url: 'functions?fn=getListing',
            dataSrc: ''
        },
        createdRow: function (row, data, dataIndex) {
            // Set the data-status attribute, and add a class

            $(row).attr("id", "listing-" + data['id'])
            // $(row).find('#swnm').attr("onClick",'SwapName(\' ' + data["6"] + '\','  + data["10"] +  ')');
            //$(row).find('a#wl').attr("href",'https://web.whatsapp.com/send/?phone='  + data["3"])
            //alert(data['1']);

        },
        columnDefs: [{
            targets: [0],
            render: function (data, type, row) {

                return "<input type='checkbox' value='"+data+"' name='listingbox' class='selectionbox' >";
            }
        },{
            targets: [4],
            render: function (data, type, row) {

                var numbersString = data;

                // Convert the string to an array of numbers
                var numbersArray = numbersString.split(", ");
                var labels = "";
                // Iterate through the array using jQuery's $.each() function
                $.each(numbersArray, function (index, value) {
                    var newv = GetLabelName(lbl, value)
                    if (labels == "") {
                        labels = newv
                    } else {
                        labels = labels + ", " + newv;
                    }
                })


                return labels;
            }
        },
                     {
                         targets: [5],
                         render: function (data, type, row) {
                             return GetStatusName(st, data);
                         }
                     },
                     {
                         targets: [6],
                         render: function (data, type, row) {
                             return GetCampName(camps, data);
                         }
                     },
                     {
                         targets: [7],
                         render: function (data, type, row) {
                             //alert(uid)
                             return '<button class="btn btn-primary btn-icon rounded-11 me-2 singleLIstEdit" onclick="singleLIstEdit(' + data + ')" data-bs-toggle="modal" data-bs-target="#UpdateSingleList" data-bs-original-title="Edit"><i class="fe fe-edit"></i></button><button class="btn btn-warning btn-icon rounded-11 me-2" style="display: none" onClick="editlist2(' + data + ')" data-bs-toggle="tooltip" data-bs-original-title="Update"><i style="width: 16px;height: 20px;font-size: 19px;" class="ion-checkmark-round"></i></button><button class="btn btn-danger btn-icon rounded-11 singleDelete" onclick="singleDelete(' + data + ')" ><i class="fa fa-times-circle"></i></button>';

                         }
                     }

                    ],
        columns: [{
            title: '<input id="check-all" type="checkbox">',
            data: "id"
        },
                  {
                      data: "name",
                      class: "name"
                  },
                  {
                      data: "phone",
                      class: "phone"
                  },
                  {
                      data: "country",
                      class: "country"
                  },
                  {
                      data: "cat",
                      class: "cat"

                  },
                  {
                      data: "status",
                      class: "status"
                  },
                  {
                      data: "lids",
                      class: "lids"

                  },
                  {
                      data: "id"

                  },

                 ],


    });
}
//single record delete
function singleLIstEdit(id) {
    event.preventDefault();
    console.log(id);
}
function singleLIstEdit(id) {
    event.preventDefault();

    var id  = '#listing-'+id;
    console.log(id)
    var name = jQuery(id+" .name").text();
    var  phone = jQuery(id+" .phone").text();
    var  country = jQuery(id+" .country").text();
    var   cat = jQuery(id+" .cat").text();
    var   status = jQuery(id+" .status").text();
    var   lids = jQuery(id+" .lids").text();
    console.log(name)
    console.log(phone)
    console.log(country)
    console.log(cat)
    console.log(status)
    console.log(lids)
    var name = jQuery("#UpdateSingleList #fullName").val(name);
    var name = jQuery("#UpdateSingleList #mobileNumber").val(phone);
    var name = jQuery("#UpdateSingleList #country").val(country);
    


};

function singleDelete(id) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "multiledelete.php",
        data: { 
            delete_ids :id,
        },
        success: function(data) {
            console.log(data);

            $('#responsive-datatable').DataTable().destroy();
            createListingTable();

        },
        error: function(data) {
            console.log(data)
        }
    });

};


$(".singleDelete").on("click",function () {
    event.preventDefault();
    singleDelete(id);
});

$(".singleLIstEdit").on("click",function () {
    event.preventDefault();
    singleLIstEdit(id);

});

function multipleUpdate() {
    var targeted_multi_select = [];
    var updatedList = [];
    var selectedStatus = $('select#selectstatusMultiple').val(); 
    var updatedCampaign = $('#clidsMultiple').val(); 


    $('input.selectionbox:checked').each(function() {
        targeted_multi_select.push($(this).val());
    });
    //alert(targeted_multi_select);

    $('#labelscheckboxsMultiple input:checked').each(function() {
        updatedList.push($(this).val());
    });

    $.ajax({
        type: "POST",
        url: "multileUpdates.php",
        data: { 
            tableTargetIds :targeted_multi_select,
            targetedIds: updatedList,
            status: selectedStatus,
            updatedCampaign: updatedCampaign,

        },
        success: function(data) {
            console.log(data);
            $('#multipleUpdate').modal('toggle');
            $('#responsive-datatable').DataTable().destroy();
            createListingTable()
        },
        error: function(data) {
            console.log(data)
        }
    });

}
function multipleDelete() {
    //      multiple delete          

    var delete_ids = [];

    $('input.selectionbox:checked').each(function() {
        delete_ids.push($(this).val());
    });



    $.ajax({
        type: "POST",
        url: "multiledelete.php",
        data: { 
            delete_ids :delete_ids,
        },
        success: function(data) {
            console.log(data);
            $('#multipleUpdate').modal('toggle');
            $('#responsive-datatable').DataTable().destroy();
            createListingTable();

        },
        error: function(data) {
            console.log(data)
        }
    });


}



