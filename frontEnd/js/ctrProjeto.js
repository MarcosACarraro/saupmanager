var ctrProjeto = (function () {
    var _id = 0;
    var _idEdit = 0;
    var _idExcluir = 0;
    var _datasource = [];
    var _table = {};
    var _formValid = 0;
    var _txtProjeto;
    var _confirmDeleteProjeto = {};
    var _max = 0;
   

    var _create = function () {
        createTable();
        createEdit();
       
         _confirmDeleteProjeto = ConfirmDelete();
        _confirmDeleteProjeto.create("divConfirm", "Projeto");
    }
    

    function createTable() {
        /*table vai na div principal*/
        var _tableProjetoiner = window.document.getElementById("tableContainer");
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
        cell0.innerHTML = "codigo";
        cell1.innerHTML = "Projeto";
        cell2.innerHTML = "Progresso";
        cell3.innerHTML = "Estimativa";
        cell4.innerHTML = "Impirmir";
        cell5.innerHTML = "Tarefa";
        cell6.innerHTML = "Editar";
        cell7.innerHTML = "Excluir";
        _tableProjetoiner.appendChild(_table);

    }

    function createEdit() {

        _txtProjeto = window.document.getElementById("txtProjeto");
        _txtProjeto.onchange = _txtProjetoValidade;
        _txtProjeto.onkeyup = _txtProjetoValidade;
        _txtProjeto.setAttribute("maxlength", "50");
        _resetValidation.call(this);

        $("#gridPainel").collapse('show');
        $("#editPainel").collapse('hide');

        $("#divBackup").hide();
    }

    var _tableDataBind = function () {
        _limpar.call(this);
        var linha = 0;
        for (var i = 0; i < _datasource.length; i++) {
            linha++;

            _divBar = window.document.createElement("div");
            _divBar.setAttribute("class", "progress-bar bg-blue");
            _divBar.setAttribute("role", "progressbar");
            _divBar.setAttribute("data-transitiongoal", _datasource[i].Progresso);
            _divBar.setAttribute("style", "width: " + _datasource[i].Progresso + "%");
            _divBar.setAttribute("aria-valuenow", _datasource[i].Progresso);
           
            _legend = window.document.createElement("small");
            _legend.innerHTML = _datasource[i].Progresso + " % Complete";
   
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

            cell0.innerHTML = _datasource[i].CodProjeto;
            cell1.innerHTML = _datasource[i].Descricao;
            cell2.appendChild(_divProgress);
            cell2.appendChild(_legend);
            cell3.innerHTML = _datasource[i].Estimativa;
            cell4.innerHTML = "<a href='#' onClick='ctrProjeto.printTarefaAt(" + _datasource[i].CodProjeto + ");return false;'><span class='glyphicon glyphicon-print'></span></a></div>";
            cell5.innerHTML = "<a href='#' onClick='ctrProjeto.editTarefaAt(" + _datasource[i].CodProjeto + ");return false;'><span class='glyphicon glyphicon-list-alt'></span></a></div>";
            cell6.innerHTML = "<a href='#' onClick='ctrProjeto.editAt(" + _datasource[i].CodProjeto + ");return false;'><span class='glyphicon glyphicon-edit'></span></a></div>";
            cell7.innerHTML = "<a href='#' onClick='ctrProjeto.confirm(" + _datasource[i].CodProjeto + ");return false;'><span class='glyphicon glyphicon-trash'></span></a></div>";
        }
    }

    var _upLoadJSON = function () {
        var file = document.getElementById("myFile").files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            _datasource = JSON.parse(e.target.result);
            _tableDataBind.call(this);
        };
        reader.readAsText(file);
    }

    var _saveJSON = function () {
        var json = JSON.stringify(_datasource);
        var blob = new Blob([json], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.download = "backup.json";
        a.href = url;
        a.textContent = "Download backup.json";
        a.setAttribute("style", "color: white");
 
        var div = document.getElementById("saveJSON");
        div.appendChild(a);

        $("#divBackup").show();
    };

    var _newItem = function () {
        _idEdit = 0;
        _txtProjeto.value = "";
        $("#gridPainel").collapse('hide');
        $("#editPainel").collapse('show');
        _resetValidation.call(this);
    }

    var _validate = function () {
        _formValid = 0;
        _formValid += _txtProjetoValidade.call(this);
        return (_formValid == 0);
    }

    var _txtProjetoValidade = function () {
        if (_txtProjeto.value.length > 3) {
            return _toggleValidade.call(this, _txtProjeto, true, "");
        } else {
            return _toggleValidade.call(this, _txtProjeto, false, "Erro na Projeto!!!");
        }
    }

    var _resetValidation = function () {
        _toggleValidade.call(this, _txtProjeto, true, "");

        $("#divAlertSave").hide();
        _formValid = 0;
    }

    var _toggleValidade = function (input, valid, message) {
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

    var _limpar = function () {
        var tableHeaderRowCount = 1;
        var rowCount = _table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            _table.deleteRow(tableHeaderRowCount);
        }
    }

    var _save = function () {
        if (_validate.call(this)) {
            var _item = {
                CodProjeto: _idEdit,
                Descricao: _txtProjeto.value,
                Progresso: 0,
                Estimativa:0, 
                tarefas: []
            };

            _sabeDB(_item);

            _txtProjeto.value = "";
       
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
            if (_datasource[i].CodProjeto === id) {
                _txtProjeto.value = _datasource[i].Descricao;
                _idEdit = id;
            }
        }
        $("#gridPainel").collapse('hide');
        $("#editPainel").collapse('show');
        _resetValidation.call(this);
    }

    var _confirm = function (id) {
        _idExcluir = id;
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProjeto === id) {
                _confirmDeleteProjeto.setMessage(_datasource[i].Descricao);
            }
        }
        _confirmDeleteProjeto.show();
        _resetValidation.call(this);
    }

    var _removeAt = function () {
        _deleteDB(_idExcluir);
        _idExcluir = 0;
        _confirmDeleteProjeto.hide();
        _resetValidation.call(this);
        _tableDataBind.call(this);
    }

    function _sabeDB(item) {
        if (item.CodProjeto !== 0) {
            for (var i = 0; i < _datasource.length; i++) {
                if (_datasource[i].CodProjeto === item.CodProjeto) {
                    _datasource[i].Descricao = _txtProjeto.value;
                }
            }
        } else {
            item.CodProjeto = getMax();
            _datasource.push(item);
        }
    }

    function _deleteDB(id) {
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProjeto === _idExcluir) {
                _datasource.splice(i, 1);
            }
        }
    }
   

    var _editClose = function () {
        _idEdit = 0;
        _txtProjeto.value = "";
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
        var _lblProjeto = window.document.getElementById("lblProjeto");

        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProjeto === id) {
                _lblProjeto.innerHTML = "Projeto:&nbsp;" + _datasource[i].Descricao;
                ctrTarefa.create(_datasource[i]);
            }
        }
        $("#gridPainel").collapse('hide');
        $("#editTarefa").collapse('show');
    }

    var _printTarefaAt = function (id) {
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodProjeto === id) {
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
   

    function getMax() {
        var max = 0;
        for (var i = 0 ; i < _datasource.length ; i++) {
            if (!max || parseInt(_datasource[i].CodProjeto) > parseInt(max))
                max = _datasource[i].CodProjeto;
        }
        return max+1;
    }

    var _listar = function () {
        return _datasource;
    }

    var _dataBind = function () {
        _tableDataBind.call(this);
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
        listar: _listar,
        dataBind: _dataBind,
        saveJSON: _saveJSON,
        upLoadJSON: _upLoadJSON,
        printTarefaAt: _printTarefaAt,
        printClose: _printClose
    }
})();