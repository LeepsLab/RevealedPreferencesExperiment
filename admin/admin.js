RedwoodRevealedPreferences.controller("RPAdminController", ["$rootScope", "$scope", "Admin", function($rootScope, $scope, ra) {

  var Display = { //Display controller

        initialize: function() {
            $("#start-session").click(function () {
                $("#start-session").attr("disabled", "disabled");
                ra.trigger("start_session");
            });

            ra.on("start_session", function() {
                $("#start-session").attr("disabled", "disabled");
                $("#pause-session").removeAttr("disabled");
            });

            $("#refresh-subjects").click(function () {
                $("#refresh-subjects").attr("disabled", "disabled");
                ra.refreshSubjects().then(function() {
                    $("#refresh-subjects").removeAttr("disabled");
                });
            });

            $("#reset-session").click(function () {
                ra.reset();
            });

            $("#pause-session").click(function () {
                $("#pause-session").attr("disabled", "disabled");
                ra.trigger("pause");
            });
            ra.on("pause", function() {
                $("#pause-session").attr("disabled", "disabled");
            });

            $("#resume-session").click(function () {
                $("#resume-session").attr("disabled", "disabled");
                ra.trigger("resume");
            });
            ra.on("resume", function() {
                $("#resume-session").attr("disabled", "disabled");
                $("#pause-session").removeAttr("disabled");
            });

            ra.on_all_paused(function() {
                $("#resume-session").removeAttr("disabled");
            });

            $("#archive").click(function () {
                var r = confirm("Are you sure you want to archive this session?");
                if(r == true) {
                    ra.delete_session();
                }
            });

            ra.on_router_connected(function(connected) { //Display router connection status
                var status = $("#router-status");
                if (connected) {
                    status.text("Router Connected");
                    status.removeClass("alert-danger");
                    status.addClass("alert-success");
                } else {
                    status.text("Router Disconnected");
                    status.removeClass("alert-success");
                    status.addClass("alert-danger");
                }
            });

            ra.on_set_config(function(config) { //Display the config file
                $("table.config").empty();
                var a = $.csv.toArrays(config);
                for (var i = 0; i < a.length; i++) {
                    var row = a[i];
                    var tr = $("<tr>");
                    for (var j = 0; j < row.length; j++) {
                        var cell = row[j];
                        var td = $((i == 0 ? "<th>" : "<td>")).text(cell);
                        tr.append(td);
                    }
                    $("table.config").append(tr);
                }
            });
        }
    };


    var resetGroups = function() {
        var config = ra.get_config(1, 0) || {};
        for (var i = 0; i < ra.subjects.length; i++) { //set all subjects to group 1 (this is so that matching can be changed per period)
            if($.isArray(config.groups)) {
                for(var groupId = 0; groupId < config.groups.length; groupId++) {
                    if($.isArray(config.groups[groupId])) {
                        if(config.groups[groupId].indexOf(parseInt(ra.subjects[i].user_id)) > -1) { //Nested group array
                            ra.set_group(groupId + 1, ra.subjects[i].user_id);
                        }
                    } else {
                        ra.set_group(1, ra.subjects[i].user_id);
                    }
                }
            } else {
                ra.set_group(1, ra.subjects[i].user_id);
            }
        }
        $scope.subjects = ra.subjects;
    };

    Display.initialize();

    ra.on_load(function () {
        resetGroups(); //Assign groups to users
    });

    ra.on_register(function(user) {
        resetGroups();
    });

    ra.on("start_session", function() {
        ra.start_session();
    });

    ra.on("pause", function() {
        ra.pause();
    });

    ra.on("resume", function() {
        ra.resume();
    });

}]);

