//
//
//
//
//// JavaScript Document
//
//
//function multipleDelete1() {
//console.log("click...");
//}
//function generateInputs(id,type){
//
//    if(type =='status'){
//        var item="select#"+id;
//        const $statusList = $(item);
//
//        $.each(st, function(index, item) {
//            const option = $("<option></option>")
//            .attr("value", item.sid)
//            .text(item.title)
//            $statusList.append(option);
//        });}
//
//    if(type =='camp'){
//        var item="select#"+id;
//        const $clidsList = $(item);
//
//        $.each(camps, function(index, item) {
//            const option = $("<option></option>")
//            .attr("value", item.lids)
//            .text(item.title)
//            $clidsList.append(option);
//        });
//    }
//    if(type =='label'){
//        var item="div#"+id;
//        const lblsList = $(item);
//
//        $.each(lbl, function(index, item) {
//            const option = "<input type=\"checkbox\" id=\"" +item.lid+ "\" name=\"label[]\" value=\"" +item.lid+ "\"> <label for=\"" +item.lid+ "\"> " +item.title+ "</label><br>";
//            lblsList.append(option);
//        });
//    }
//
//}
//
//
//
//function GetStatusName(st, sid) {
//    if(sid){
//
//        let jsonData = st;
//
//        // Find object with given sid and retrieve its title property
//        let obj = $.grep(jsonData, function (item) {
//            return item.sid === sid;
//        })[0];
//        let title = obj.title;
//
//        return title;
//    }
//    else{return "null"}
//    // Convert JSON string to JavaScript object
//
//}
//
//function GetLabelName(lbl, lid) {
//
//    if(lid){let jsonData = lbl;
//
//            // Find object with given sid and retrieve its title property
//            let obj = $.grep(jsonData, function (item) {
//                return item.lid === lid;
//            })[0];
//            let title = obj.title;
//
//            return title;}
//    else return "null"
//
//}
//
//function createListingTable() {
//
//    $('#responsive-datatable').dataTable({
//        order: [
//            [0, 'desc']
//        ],
//        processing: true,
//        ajax: {
//            url: 'functions?fn=getListing',
//            dataSrc: ''
//        },
//        createdRow: function (row, data, dataIndex) {
//            // Set the data-status attribute, and add a class
//            $(row).attr("id", "listing-" + data['0'])
//            // $(row).find('#swnm').attr("onClick",'SwapName(\' ' + data["6"] + '\','  + data["10"] +  ')');
//            //$(row).find('a#wl').attr("href",'https://web.whatsapp.com/send/?phone='  + data["3"])
//            //alert(data['1']);
//
//        },
//        columnDefs: [{
//            targets: [0],
//            render: function (data, type, row) {
//
//                return "<input type='checkbox' value='"+data+"' name='listingbox' class='selectionbox' >";
//            }
//        },{
//            targets: [4],
//            render: function (data, type, row) {
//
//                var numbersString = data;
//
//                // Convert the string to an array of numbers
//                var numbersArray = numbersString.split(", ");
//                var labels = "";
//                // Iterate through the array using jQuery's $.each() function
//                $.each(numbersArray, function (index, value) {
//                    var newv = GetLabelName(lbl, value)
//                    if (labels == "") {
//                        labels = newv
//                    } else {
//                        labels = labels + ", " + newv;
//                    }
//                })
//
//
//                return labels;
//            }
//        },
//                     {
//                         targets: [5],
//                         render: function (data, type, row) {
//                             return GetStatusName(st, data);
//                         }
//                     },
//                     {
//                         targets: [7],
//                         render: function (data, type, row) {
//                             //alert(uid)
//                             return '<button class="btn btn-primary btn-icon rounded-11 me-2" onClick="editlist(' + data["id"] + ')" data-bs-toggle="tooltip" data-bs-original-title="Edit"><i class="fe fe-edit"></i></button><button class="btn btn-warning btn-icon rounded-11 me-2" style="display: none" onClick="editlist2(' + data["id"] + ')" data-bs-toggle="tooltip" data-bs-original-title="Update"><i style="width: 16px;height: 20px;font-size: 19px;" class="ion-checkmark-round"></i></button><button class="btn btn-danger btn-icon rounded-11" data-bs-toggle="tooltip" onclick="deletelist(' + data["id"] + ')" data-bs-original-title="Delete"><i class="fa fa-times-circle"></i></button>';
//
//                         }
//                     }
//
//                    ],
//        columns: [{
//            data: "id"
//        },
//                  {
//                      data: "name",
//                      class: "name"
//                  },
//                  {
//                      data: "phone"
//                  },
//                  {
//                      data: "country"
//                  },
//                  {
//                      data: "cat"
//                  },
//                  {
//                      data: "status"
//                  },
//                  {
//                      data: "lids"
//                  },
//                  {
//                      data: "id"
//                  },
//
//                 ],
//
//
//    });
//}
//
//
//
//
//
//function multipleUpdate() {
//
//    $(".multipleUpdate").on("click",function () {
//        event.preventDefault();
//        var targeted_multi_select = [];
//        var updatedList = [];
//        var selectedStatus = $('.update-status select').find(":selected").val(); 
//        var updatedCampaign = $('#clidsMultiple').find(":selected").val(); 
//
//        $('input.selectionbox:checked').each(function() {
//            targeted_multi_select.push($(this).val());
//        });
//
//        $('#labelscheckboxsMultiple input:checked').each(function() {
//            updatedList.push($(this).val());
//        });
//
//        $.ajax({
//            type: "POST",
//            url: "multileUpdates.php",
//            data: { 
//                tableTargetIds :targeted_multi_select,
//                targetedIds: updatedList,
//                status: selectedStatus,
//                updatedCampaign: updatedCampaign,
//
//            },
//            success: function(data) {
//                console.log(data);
//                $('#multipleUpdate').modal('toggle');
//                $('#responsive-datatable').DataTable().destroy();
//                createListingTable()
//            },
//            error: function(data) {
//                console.log(data)
//            }
//        });
//
//    });
//
//}
//function multipleDelete() {
//
//
//
//    //      multiple delete          
//    $(".multipleDelete").on("click",function () {
//        event.preventDefault();
//        var delete_ids = [];
//
//        $('input.selectionbox:checked').each(function() {
//            delete_ids.push($(this).val());
//        });
//
//
//
//        $.ajax({
//            type: "POST",
//            url: "multiledelete.php",
//            data: { 
//                delete_ids :delete_ids,
//            },
//            success: function(data) {
//                console.log(data);
//                $('#multipleUpdate').modal('toggle');
//                $('#responsive-datatable').DataTable().destroy();
//                createListingTable();
//
//            },
//            error: function(data) {
//                console.log(data)
//            }
//        });
//    })
//
//}
//
