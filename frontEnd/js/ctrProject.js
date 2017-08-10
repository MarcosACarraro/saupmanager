var ctrProject = (function () {
    var _id = 0;
    var _idEdit = 0;
    var _idDelete = 0;
    var _datasource = [];
    var _table = {};
    var _formValid = 0;
    var _txtProject;
    var _confirmDeleteProject = {};
    var _pagination = {};
    var _skip = 0;
    var _take = 20;
    var _indexPage = 1;

    var _create = function () {
        createTable();
        createEdit();
        _confirmDeleteProject = ConfirmDelete();
        _confirmDeleteProject.create("divConfirm", "Project");
        _search("");
    }
    

    function createTable() {
        /*table vai na div principal*/
        var _tableProject = window.document.getElementById("tableContainer");
        _table = window.document.createElement("table");
        _table.setAttribute("class", "table table-striped table-hover table-responsive");

        var row = _table.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        var cell7 = row.insertCell(7);
        cell0.innerHTML = "#";
        cell1.innerHTML = "Project";
        cell2.innerHTML = "Progress";
        cell3.innerHTML = "ETA";
        cell4.innerHTML = "Print";
        cell5.innerHTML = "Task";
        cell6.innerHTML = "Edit";
        cell7.innerHTML = "Delete";
        _tableProject.appendChild(_table);

    }

    function createEdit() {

        _txtProject = window.document.getElementById("txtProject");
        _txtProject.onchange = _txtProjectValidate;
        _txtProject.onkeyup = _txtProjectValidate;
        _txtProject.setAttribute("maxlength", "50");
        _resetValidation.call(this);

        $("#gridPainel").collapse('show');
        $("#editPainel").collapse('hide');
    }

    var _tableDataBind = function () {
        _tableClean.call(this);
        var linha = 0;
        for (var i = 0; i < _datasource.length; i++) {
            linha++;

            _divBar = window.document.createElement("div");
            _divBar.setAttribute("class", "progress-bar bg-blue");
            _divBar.setAttribute("role", "progressbar");
            _divBar.setAttribute("data-transitiongoal", _datasource[i].Progress);
            _divBar.setAttribute("style", "width: " + _datasource[i].Progress + "%");
            _divBar.setAttribute("aria-valuenow", _datasource[i].Progress);
           
            _legend = window.document.createElement("small");
            _legend.innerHTML = _datasource[i].Progress + " % Complete";
   
            _divProgress = window.document.createElement("div");
            _divProgress.setAttribute("class", "progress progress_sm");
            _divProgress.appendChild(_divBar);
     
       
            var row = _table.insertRow(linha);
            var cell0 = row.insertCell(0);
            cell0.setAttribute("width", "30px");

            var cell1 = row.insertCell(1);
            cell1.setAttribute("width", "200px");

            var cell2 = row.insertCell(2);
            cell2.setAttribute("class", "project_progress");
    
            var cell3 = row.insertCell(3);
            cell3.setAttribute("width", "30px");
            cell3.setAttribute("align", "center");
            var cell4 = row.insertCell(4);
            cell4.setAttribute("width", "30px");
            cell4.setAttribute("align", "center");
            var cell5 = row.insertCell(5);
            cell5.setAttribute("width", "30px");
            cell5.setAttribute("align", "center");
            var cell6 = row.insertCell(6);
            cell6.setAttribute("width", "30px");
            cell6.setAttribute("align", "center");
            var cell7 = row.insertCell(7);
            cell7.setAttribute("width", "30px");
            cell7.setAttribute("align", "center");

            cell0.innerHTML = _datasource[i].CodProject;
            cell1.innerHTML = _datasource[i].Description;
            cell2.appendChild(_divProgress);
            cell2.appendChild(_legend);
            cell3.innerHTML = _datasource[i].ETA;
            cell4.innerHTML = "<a href='#' onClick='ctrProject.printTarefaAt(" + _datasource[i].CodProject + ");return false;'><span class='glyphicon glyphicon-print'></span></a></div>";
            cell5.innerHTML = "<a href='#' onClick='ctrProject.editTarefaAt(" + _datasource[i].CodProject + ");return false;'><span class='glyphicon glyphicon-list-alt'></span></a></div>";
            cell6.innerHTML = "<a href='#' onClick='ctrProject.editAt(" + _datasource[i].CodProject + ");return false;'><span class='glyphicon glyphicon-edit'></span></a></div>";
            cell7.innerHTML = "<a href='#' onClick='ctrProject.confirm(" + _datasource[i].CodProject + ");return false;'><span class='glyphicon glyphicon-trash'></span></a></div>";
        }
    }
 
    var _newItem = function () {
        _idEdit = 0;
        _txtProject.value = "";
        $("#gridPainel").collapse('hide');
        $("#editPainel").collapse('show');
        _resetValidation.call(this);
    }

    var _validate = function () {
        _formValid = 0;
        _formValid += _txtProjectValidate.call(this);
        return (_formValid == 0);
    }

    var _txtProjectValidate = function () {
        if (_txtProject.value.length > 3) {
            return _toggleValidate.call(this, _txtProject, true, "");
        } else {
            return _toggleValidate.call(this, _txtProject, false, "Erro na Project!!!");
        }
    }

    var _resetValidation = function () {
        _toggleValidate.call(this, _txtProject, true, "");

        $("#divAlertSave").hide();
        _formValid = 0;
    }

    var _toggleValidate = function (input, valid, message) {
        var _div = $(input).parent();
        if (valid) {
            $(_div).removeClass("form-group has-error has-feedback");
            $(_div).find("span").hide();
            return 0;
        } else {
            $(_div).addClass("form-group has-error has-feedback");
            $(_div).find("span").show();
            $(_div).find("span")[1].innerHTML = message;
            return 1;
        }
    }

    var _tableClean = function () {
        var tableHeaderRowCount = 1;
        var rowCount = _table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            _table.deleteRow(tableHeaderRowCount);
        }
    }

    var _save = function () {
        if (_validate.call(this)) {
            var _item = {
                CodProject: _idEdit,
                Description: _txtProject.value,
                Progress: 0,
                ETA:0
            };

            _sabeDB(_item);
            _search("");
            _txtProject.value = "";
            _idEdit = 0;
            $("#gridPainel").collapse('show');
            $("#editPainel").collapse('hide');
            _tableDataBind.call(this);

        } else {
            $("#divAlertSave").show();
        }
    }

    var _editAt = function (id) {
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProject === id) {
                _txtProject.value = _datasource[i].Description;
                _idEdit = id;
            }
        }
        $("#gridPainel").collapse('hide');
        $("#editPainel").collapse('show');
        _resetValidation.call(this);
    }

    var _confirm = function (id) {
        _idDelete = id;
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProject === id) {
                _confirmDeleteProject.setMessage(_datasource[i].Description);
            }
        }
        _confirmDeleteProject.show();
        _resetValidation.call(this);
    }

    var _removeAt = function () {
        _deleteDB(_idDelete);
        _search("");
        _idDelete = 0;
        _confirmDeleteProject.hide();
        _resetValidation.call(this);
        _tableDataBind.call(this);
    }


    function _search(description) {
        $.ajax({
            async: true,
            cache: false,
            url: "/projects",
            type: "GET",
            data: {
                cmd: "Select",
                Description: description,
                skip: _skip,
                take: _take
            },
            datatype: "JSON",
            success: function (data, success) {
                if (success = "success") {
                    _datasource = JSON.parse(data);
                    _tableDataBind.call(this);
                }
            },
            error: function () {
                alert('Erro carregar registros!');
            }
        });

        _searchTotalRecords(description, _paginacao);
    }

    function _searchTotalRecords(description, callback) {
        var _skip = 0;
        var _take = 0;
        $.ajax({
            async: true,
            cache: false,
            url: "/projects",
            type: "GET",
            data: {
                cmd: "Count",
                Description: description,
                skip: _skip,
                take: _take
            },
            datatype: "JSON",
            success: function (data, success) {
                if (success = "success") {
                    var result = JSON.parse(data);
                    callback(result[0].Total);
                }
            },
            error: function () {
                alert('Err load register!');
            }
        });
    }

    function _paginacao(total) {

        var totalPages = Math.ceil(total / _take);

        _pagination = window.document.getElementById("ulProject");
        if (_pagination) _pagination.remove();


        if (totalPages > 1) {
            var limitButtons = 5;
            var lastButton = 0;
            var start = 1;

            lastButton = (totalPages < limitButtons) ? totalPages : limitButtons;

            if (_indexPage > limitButtons) {
                start = (_indexPage - limitButtons + 1);
                lastButton = (start + limitButtons - 1);
            }

            _pagination = window.document.createElement("ul");
            _pagination.setAttribute("id", "ulProject")
            _pagination.setAttribute("class", "pagination pagbottom");

            if (_indexPage > limitButtons) {
                var li = window.document.createElement("li");
                li.innerHTML = "<a href='#' onClick='ctrProject.SetPage(" + (_indexPage - 1) + ");return false;'>&laquo;</a>";
                _pagination.appendChild(li);
            }

            for (i = start; i <= lastButton; i++) {
                var li = window.document.createElement("li");
                li.innerHTML = "<a href='#' onClick='ctrProject.SetPage(" + i + ");return false;'>" + i + "</a>";

                if (i === _indexPage) {
                    li.setAttribute("class", "active");
                }
                _pagination.appendChild(li);
            }

            if (totalPages > lastButton) {
                if (_indexPage < totalPages) {
                    var li = window.document.createElement("li");
                    li.innerHTML = "<a href='#' onClick='ctrProject.SetPage(" + (_indexPage + 1) + ");return false;'>&raquo;</a>";
                    _pagination.appendChild(li);
                }
            }
            var _divPaging = window.document.getElementById("divPaging");
            _divPaging.appendChild(_pagination);
        }
    }

    function _sabeDB(item) {
        $.ajax({
            async: true,
            cache: false,
            url: "/project",
            type: "POST",
            data: item,
            datatype: "JSON",
            success: function (response) {
                //alert(response.success);
            },
            error: function () {
                alert('Error saving!');
            }
        });
    }

    function _deleteDB(id) {
        $.ajax({
            async: true,
            cache: false,
            url: "/projects",
            type: "GET",
            data: {
                cmd: "Delete",
                id: id
            },
            datatype: "JSON",
            success: function (response) {
                //alert(response.success);
            },
            error: function () {
                alert('Err Deleting!');
            }
        });
    }
   

    var _editClose = function () {
        _idEdit = 0;
        _txtProject.value = "";
        $("#gridPainel").collapse('show');
        $("#editPainel").collapse('hide');
    }

    var _toggleFilter = function () {
        if (_toShow) {
            $("#divFilterBodyCollapse").collapse('show');
            $("#iconFilter").find('i').removeClass('glyphicon-filter').addClass('glyphicon-chevron-up');
            _toShow = false;
        }
        else {
            $("#divFilterBodyCollapse").collapse('hide');
            $("#iconFilter").find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-filter');
            _toShow = true;
        }
    }

    var _editTarefaAt = function (id) {
        var _lblProject = window.document.getElementById("lblProject");

        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProject === id) {
                _lblProject.innerHTML = "Project:&nbsp;" + _datasource[i].Description;
                ctrTarefa.create(_datasource[i]);
            }
        }
        $("#gridPainel").collapse('hide');
        $("#editTarefa").collapse('show');
    }

    var _printTarefaAt = function (id) {
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProject === id) {
                ctrPrint.create(_datasource[i]);
            }
        }
        $("#gridPainel").collapse('hide');
        $("#editPrint").collapse('show');
    }

    var _printClose = function () {
        $("#gridPainel").collapse('show');
        $("#editPrint").collapse('hide');
    }

    var _editTarefaClose = function () {
        $("#gridPainel").collapse('show');
        $("#editTarefa").collapse('hide');
    }

    var _SetPage = function (index) {
        _skip = ((index - 1) * _take);
        _indexPage = index;
        _search("");
    }



    return {
        create: _create,
        newItem: _newItem,
        editTarefaAt:_editTarefaAt,
        save: _save,
        editAt: _editAt,
        confirm: _confirm,
        removeAt: _removeAt,
        editClose: _editClose,
        toggleFilter: _toggleFilter,
        editTarefaClose: _editTarefaClose,
        printTarefaAt: _printTarefaAt,
        printClose: _printClose,
        SetPage: _SetPage
    }
})();